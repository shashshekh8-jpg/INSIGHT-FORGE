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

def route_evaluation(state: AgentState):
    """Reflexion logic to route failures back for self-correction"""
    if state.get("errors") and state.get("iteration_count", 0) < 3:
        return "error"
    return "success"

workflow = StateGraph(AgentState)
workflow.add_node("planner", plan_node)
workflow.add_node("executor", execute_node)
workflow.set_entry_point("planner")
workflow.add_edge("planner", "executor")
workflow.add_conditional_edges("executor", route_evaluation, {"success": END, "error": "critic"})
workflow.add_edge("critic", "executor")

tri_brain_app = workflow.compile()
