from typing import TypedDict, Annotated
import operator
from langgraph.graph import StateGraph, END
from app.orchestration.planner_agent import generate_plan
from app.orchestration.semantic_router import route_query
from app.orchestration.critic_agent import self_correct_code

class AgentState(TypedDict):
    query: str
    plan: str
    engine_used: str
    generated_code: str
    result: dict
    errors: Annotated[list[str], operator.add]
    iteration_count: int

def plan_node(state: AgentState):
    plan = generate_plan(state["query"])
    return {"plan": plan, "iteration_count": state.get("iteration_count", 0)}

def execute_node(state: AgentState):
    engine, code_dict = route_query(state["plan"], state["query"])
    return {
        "engine_used": engine,
        "generated_code": code_dict["code"],
        "result": code_dict["result"]
    }

def critic_node(state: AgentState):
    """Wrapper to adapt the Reflexion logic to the LangGraph state paradigm."""
    failed_code = state.get("generated_code", "")
    
    # Extract the most recent error, or provide a default fallback
    error_msg = state["errors"][-1] if state.get("errors") else "Unknown execution error"
    
    # Hardcoded schema for the Groq prompt context
    schema_definition = "transaction_id, timestamp, amount_inr, sender_state, receiver_bank, device_type, network_type, verification_status, fraud_flag"
    
    # Call the external Groq agent
    corrected_code = self_correct_code(failed_code, error_msg, schema_definition)
    
    return {
        "generated_code": corrected_code,
        "iteration_count": state.get("iteration_count", 0) + 1
    }

def route_evaluation(state: AgentState):
    """Reflexion logic to route failures back for self-correction"""
    if state.get("errors") and state.get("iteration_count", 0) < 3:
        return "error"
    return "success"

# --- Graph Assembly ---

workflow = StateGraph(AgentState)
workflow.add_node("planner", plan_node)
workflow.add_node("executor", execute_node)
workflow.add_node("critic", critic_node)  # <-- The missing node is now registered

workflow.set_entry_point("planner")
workflow.add_edge("planner", "executor")

# Conditional cyclic routing
workflow.add_conditional_edges(
    "executor", 
    route_evaluation, 
    {"success": END, "error": "critic"}
)

# Route the critic back to the executor to try again
workflow.add_edge("critic", "executor")

tri_brain_app = workflow.compile()
