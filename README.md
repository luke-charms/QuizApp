\subsection{Application Overview}
QuizApp is an interactive quiz software deployed as a three-layer microservice architecture on Kubernetes. Users access a web interface to take multiple-choice quizzes, with questions kept in the MongoDB and accessed through a data access service called QuizWorker. 
The application's architecture follows a Data Access Layer pattern where the user interface layer (QuizApp) has no direct database access and must communicate with the data access layer (QuizWorker) via REST API.

\subsection{Core Functionality}
\begin{itemize}
    \item \textbf{Quiz Taking:} When a connection to the web UI (/) is made, the application displays a random question selected from the database, and the user is prompted to answer it through a multiple choice selection
    \item \textbf{Question Management:} Users can add questions via a web form on a separate page (/addQuestion) or using the REST API
    \item \textbf{Score Tracking:} User scores are persistent across browser sessions
    \item \textbf{REST APIs:} Both microservices (QuizApp and QuizWorker) use APIs for integration and communiction between layers of the application
\end{itemize}

\subsection{Deployment Instructions}
Run the deploy-quizapp.sh bash script to start deployment
