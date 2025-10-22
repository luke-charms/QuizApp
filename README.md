# QuizApp

**QuizApp** is an interactive, multiple-choice quiz application deployed using a **three-layer microservice architecture** on **Kubernetes**. Users engage with a web interface to test their knowledge, with all questions managed via a REST API by a separate data access service.

---

## Architecture Overview

The application follows a strict **Data Access Layer pattern** to ensure separation of concerns:

| Layer | Microservice/Component | Role | Communication |
| :--- | :--- | :--- | :--- |
| **Presentation** | **QuizApp** (Web UI) | Handles user interaction and displays the quiz. | REST API (to QuizWorker) |
| **Data Access** | **QuizWorker** | Manages question retrieval, addition, and score persistence. | REST API (to QuizApp) |
| **Data Storage** | **MongoDB** | Stores all quiz questions and user score data. | Direct access (by QuizWorker only) |

---

## Core Functionality

-   **Quiz Taking:**
    -   Accessing the main web UI (`/`) displays a random question from the database.
    -   Users are prompted to select an answer from the multiple-choice options.
-   **Question Management:**
    -   Questions can be added via a dedicated web form (`/addQuestion`).
    -   Alternatively, new questions can be inserted directly using the QuizWorker's REST API.
-   **Score Tracking:**
    -   User scores are reliably **persistent** and maintained across different browser sessions.
-   **REST APIs:**
    -   Both the QuizApp and QuizWorker microservices expose and consume REST APIs for seamless integration and inter-layer communication.

---

## 🚀 Deployment Instructions

Follow these steps to deploy QuizApp onto your local Kubernetes environment.

### Prerequisites

You must have the following software installed and configured:

1.  **Docker Desktop** (Ensure **Kubernetes** is enabled in settings).
2.  **kubectl** (Installation via Homebrew: `brew install kubectl`).

### Step 1: Clone the Project

### Step 2: Pull the images for the application microservices and the database:

# QuizApp Web UI
docker pull lukicharms/quizappv1:latest

# QuizWorker Data Access Layer
docker pull lukicharms/quizworkerv1:latest

# MongoDB Database
docker pull mongo:6.0

### Step 3: Execute Deployment Script

./deploy-quizapp.sh
