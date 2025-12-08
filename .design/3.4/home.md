


# Improve 0 to 1 Experience: Feature Discoverability
## Homepage Refactor \- Improved Feature Discovery {#homepage-refactor---improved-feature-discovery}

**Problem Statement** The RHOAI Dashboard is expanding significantly with the introduction of RHOAI 3.0 and new `watsonx.ai` capabilities, such as AI Hub, GenAI Studio, AutoRAG. The current homepage design requires refactoring to accommodate these powerful new tools, which are currently nested deep within the navigation menu. Without a centralized entry point, these new capabilities lack the visibility required for users to adopt them efficiently, and the "0 to 1" onboarding experience relies too heavily on external documentation rather than in-product discovery.

**Business Alignment**

* **Value:** A refactored homepage is essential to expose the full value of the platform's expanded feature set immediately upon login.  
* **Outcome:** Improves feature discoverability and accelerates user adoption of new RHOAI 3.0 and `watsonx.ai` components.  
* **Timeline:** Target for 3.4, Summit  
* **Jobs to be done:** \[To be filled\]

**Proposed Solution/Rationale** Refactor the homepage into a **Capability-Centric Dashboard** that highlights the full breadth of the platform.

* **Unified Entry Point:** Display clear, accessible entry points for both core RHOAI components (Workbenches, Pipelines) and new `watsonx.ai` tools (AutoRAG, Prompt Lab).  
  * Able to guide users to the right components pages based on their workflow/use case  
* **"Jump-to" Efficiency:** Enable users to launch specific tools directly from the homepage cards, reducing the need to navigate through complex menus to start a task.  
  * “Jump back in” based on recent work or visited pages  
* **Dynamic Orientation:** Utilize the homepage to guide users toward the new capabilities relevant to their persona.

**Acceptance Criteria**

* **Comprehensive Visibility:** The homepage must display and provide access to all major RHOAI and `watsonx.ai` capabilities.  
* **Direct Access:** Users must be able to "jump into a specific tool" (e.g., launch AutoRAG) directly from the landing page.  
* **Scalability:** The design must be flexible enough to feature future integrations (e.g., Data Ingestion, Model Evaluation) as the roadmap evolves.

**Affected Customers & Scope**

* **Audience:** All users (specifically enhancing the experience for new users and Data Scientists).  
* **Scope:** Dashboard Homepage (Root).

**Alternatives Approaches Considered**

* **Status Quo:** Maintaining the current homepage would leave high-value new features buried in the menu structure, hindering adoption.


# Improve 0 to 1 Experience: Quick Starts

## Background

Better onboard new users, improve feature discoverability, and help users quickly experience the value of RHOAI's powerful components. Historically, RHOAI has excelled at scaling and governance, but onboarding efforts relied mostly on documentation or CAI teams. This has led to "Day 1" friction and frustration for users. We will bridge this gap by providing an intuitive, in-platform guided experience to help users understand our GenAI workflows. 

## Problem

* “Interface is not intuitive for first time users” (Customer Exploration & Test team [RHOAI:  Product Insights - Iteration 1](https://docs.google.com/presentation/d/1136h2OLxQyWu8_IHW-l8NyoQE23WbjzU8ieMtDCU2FM/edit?slide=id.g3369a07755b_17_0#slide=id.g3369a07755b_17_0))  
* Nothing is accomplished in Day 1: customers are unable to complete POCs  
  * Storage Setup Cases: “Hindering the customer's ability to activate or utilise a feature or product, implying a delay in their learning or operational readiness”  
  * Deployment Issues: “"We can not deploy our models for projects"   
    * this made "engineering and model serving significantly less efficient"  
    * Unclear how to mount paths, pull saved models from notebook…  
* Bottlenecks for setting up  
  * Connections

## Vision and Outcome

* Customers should be able to perform 10 actions to see the value of the platform  
* 1 sentence on dashboard \= 1000 page docs: Users should be able to find quick information in context, instead of jumping link to link for one definition

## RFE

## Problem Statement

New users of RHOAI currently experience significant "Day 1" friction and frustration. While RHOAI excels at scaling and governance, onboarding efforts have historically relied on documentation or CAI teams, which often leads to customers being unable to complete POCs or accomplish anything on their first day.

Specific pain points identified include:

* The interface is not intuitive for first-time users.  
* Storage setup cases hinder the customer's ability to activate or utilize features, delaying learning and operational readiness.  
* Deployment issues, such as unclear mounting paths or difficulty pulling saved models, make engineering and model serving significantly less efficient.  
* There are general bottlenecks in setting up connections and environments.

## Business Alignment

**1\. Business Value and Impact:** The primary goal is to better onboard new users, improve feature discoverability, and help users quickly experience the value of RHOAI's powerful components. By reducing friction, we aim for customers to be able to perform 10 key actions to see the platform's value immediately. This will bridge the gap between documentation and the platform, providing quick information in context.

**2\. Alignment to Red Hat AI Outcome:** This initiative aligns with the goal of improving user experience and adoption by providing an in-platform guided experience to help users understand GenAI workflows.

## Proposed Solution/Rationale

We propose creating an intuitive, in-platform guided experience that helps users navigate RHOAI's GenAI workflows. The core of this solution is to provide "10 use case-based quick starts" that allow users to find information in context rather than jumping between documentation links.

The dashboard will guide users through essential Day 1 tasks, ensuring they can deploy, evaluate, and monitor models effectively without getting stuck on configuration details.

## Acceptance Criteria

* The feature will be considered "done" when the following 10 quick start use cases are implemented and accessible via the dashboard. These quick starts can be edited during refinement:  
1. **Chat with a model:**   
   1. Deploy a validated model using kserve-vllm  
   2. \[END\] Chat with the model in AI Playground  
2. **Chat with a MaaS model**:   
   1. Set up a MaaS tier, assign models to that tier  
   2. Chat with the model in AI PLayground  
   3. \[END\] Grab endpoints/tokens to chat with model remotely  
3. **Monitor a Deployment**   
   1. Deploy a model  
   2. \[END\] View platform and model performance metrics in Observe & Monitor  
4. **Evaluate a model**  
   1. Enable TrustyAI service and configure metric storage   
   2. \[END\] Ready to configure bias and fairness monitors on deployments  
5. **Compress a model** (Note: This might be a Day 2 item)  
   1. Enable Data Science Pipelines and provision artifact storage   
   2. \[END\] Pipeline server ready to accept model quantization jobs  
6. **Prepare data for RAG**  
   1. Configure connection to external Vector Database and enable pipeline server   
   2. \[END\] Ready to run document ingestion/chunking pipelines  
7. **Build a RAG solution**  
   1. Verify Model Serving and Vector DB connections are active   
   2. \[END\] Ready to launch AutoRAG  
8. **Evaluate a RAG solution**  
   1. Enable TrustyAI and configure RAG evaluation templates   
   2. \[END\] Ready to run RAG benchmarking jobs against a Golden Set  
9. **Generate Training Data for Finetuning**  
   1. Provision Workbench with InstructLab tools and Teacher Model access   
   2. \[END\] Workspace ready to generate synthetic data  
10. **Finetune a model**  
    1. Install CodeFlare/Ray and validate GPU quotas/Hardware Profiles \[END\] Distributed training cluster ready to launch finetuning jobs  
* Automatic way to ensure cluster provisioned in a state to implement these quick starts when launched

## Affected Customers/Partners & Scope

This enhancement primarily targets **new RHOAI users** and the **Customer Exploration & Test team** who have reported that the current interface is not intuitive. It will benefit any customer attempting to run a POC or set up their initial environment.

## Additional Documentation

Customer Usability Feedback:  
[RHOAI:  Product Insights - Iteration 1](https://docs.google.com/presentation/d/1136h2OLxQyWu8_IHW-l8NyoQE23WbjzU8ieMtDCU2FM/edit?slide=id.g35e90a8e68d_8_315#slide=id.g35e90a8e68d_8_315)  
[RHOAI UX benchmarking 2024](https://docs.google.com/presentation/d/11VH9ZjGGbAwgNqIJwUQUkhZ2ag4HxGrxsGVaCxNxT0U/edit?slide=id.g2d78d48cbf9_0_1432#slide=id.g2d78d48cbf9_0_1432)  
[RHOAI UX refresh for Summit 2024 - recommendations](https://docs.google.com/presentation/d/1HEoB76ZR5ttiPzFm0pfZoIc8BRLAjkZWAgpIYddqb4M/edit?slide=id.g2b6af3fc919_2_243#slide=id.g2b6af3fc919_2_243)  
