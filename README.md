# InsightForge: Beyond Dashboards 🌌

**A Decision Engine for the Cognitive Enterprise.**

InsightForge is an **Active Cognitive System** that perceives data as a living 3D topology and reasons about it using causal logic and verifiable code. Built by Team Shashwat.

## 🧠 The Decoupled "Tri-Brain" Architecture

InsightForge operates on a serverless-offload architecture to achieve multi-agent workflow stability on a **$0 deployment budget**.

1. **Orchestration (LangGraph):** Uses a ReAct Planner to decompose queries and a Reflexion-based Critic Agent for dynamic self-correction.
2. **Execution Layer:** 
   - **Fast Brain (`DuckDB`):** Sub-second in-memory OLAP aggregations.
   - **Deep Brain (`DoWhy`):** Causal inference to control for confounders.
   - **Structural Brain (`NetworkX`):** Edge Betweenness Centrality to map risk networks.
3. **Intelligence Layer:** A hardcoded Semantic Layer prevents hallucinations, while heavy vector embeddings are offloaded to the **Hugging Face Serverless API**.
