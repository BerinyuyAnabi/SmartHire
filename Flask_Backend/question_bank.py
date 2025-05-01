# CS Question Bank - Multiple Choice Questions

# Question difficulty levels:
# - 'junior': Entry-level positions (0-2 years experience)
# - 'mid': Mid-level positions (3-5 years experience)
# - 'senior': Senior positions (6+ years experience)

CS_QUESTIONS = {
    # General Programming and Algorithms
    "programming": [
        {
            "id": "prog_1",
            "difficulty": "junior",
            "question": "What is the time complexity of binary search on a sorted array?",
            "options": ["O(1)", "O(log n)", "O(n)", "O(n²)"],
            "correct_answer": "O(log n)",
            "explanation": "Binary search repeatedly divides the search interval in half, resulting in logarithmic time complexity."
        },
        {
            "id": "prog_2",
            "difficulty": "junior",
            "question": "Which data structure would be most efficient for implementing a priority queue?",
            "options": ["Array", "Linked List", "Heap", "Stack"],
            "correct_answer": "Heap",
            "explanation": "A heap provides O(log n) insertion and O(1) access to the minimum/maximum element."
        },
        {
            "id": "prog_3",
            "difficulty": "mid",
            "question": "What is the purpose of the 'static' keyword in Java or C#?",
            "options": [
                "To make a variable thread-safe",
                "To declare a variable that belongs to the class rather than instances",
                "To prevent a variable from being modified",
                "To allocate memory on the stack instead of the heap"
            ],
            "correct_answer": "To declare a variable that belongs to the class rather than instances",
            "explanation": "Static variables and methods belong to the class itself rather than any instance of the class."
        },
        {
            "id": "prog_4",
            "difficulty": "senior",
            "question": "Which sorting algorithm would be most efficient for sorting a nearly-sorted array?",
            "options": ["Quick Sort", "Merge Sort", "Insertion Sort", "Heap Sort"],
            "correct_answer": "Insertion Sort",
            "explanation": "Insertion sort has a best-case time complexity of O(n) when the array is nearly sorted."
        }
    ],
    
    # Web Development - Frontend
    "frontend": [
        {
            "id": "fe_1",
            "difficulty": "junior",
            "question": "Which of the following is NOT a JavaScript framework or library?",
            "options": ["React", "Angular", "Vue", "Servlet"],
            "correct_answer": "Servlet",
            "explanation": "Servlet is a Java technology for building server-side applications, not a JavaScript framework."
        },
        {
            "id": "fe_2",
            "difficulty": "junior",
            "question": "In CSS, what does the 'z-index' property control?",
            "options": [
                "The width of an element",
                "The vertical stacking order of elements",
                "The transparency of an element",
                "The animation speed of transitions"
            ],
            "correct_answer": "The vertical stacking order of elements",
            "explanation": "Z-index determines which elements appear on top of others when they overlap."
        },
        {
            "id": "fe_3",
            "difficulty": "mid",
            "question": "What is the purpose of React's Virtual DOM?",
            "options": [
                "To directly manipulate the browser's DOM",
                "To bypass browser security restrictions",
                "To optimize rendering performance by minimizing actual DOM updates",
                "To create 3D visualizations in the browser"
            ],
            "correct_answer": "To optimize rendering performance by minimizing actual DOM updates",
            "explanation": "The Virtual DOM creates an in-memory representation of the real DOM and uses a diffing algorithm to minimize actual DOM manipulations."
        },
        {
            "id": "fe_4",
            "difficulty": "senior",
            "question": "Which pattern would be most appropriate for managing global state in a large React application?",
            "options": ["Props drilling", "Context API with reducers", "Local component state only", "Inline styles"],
            "correct_answer": "Context API with reducers",
            "explanation": "For large applications, using Context API with reducers (similar to Redux) provides a scalable way to manage global state."
        }
    ],
    
    # Web Development - Backend
    "backend": [
        {
            "id": "be_1",
            "difficulty": "junior",
            "question": "What does REST stand for in the context of API design?",
            "options": [
                "Reactive State Transfer",
                "Representational State Transfer",
                "Request-Response State Technology",
                "Remote Endpoint Service Transactions"
            ],
            "correct_answer": "Representational State Transfer",
            "explanation": "REST (Representational State Transfer) is an architectural style for designing networked applications."
        },
        {
            "id": "be_2",
            "difficulty": "junior",
            "question": "Which HTTP method is typically used to update an existing resource in a RESTful API?",
            "options": ["GET", "POST", "PUT", "DELETE"],
            "correct_answer": "PUT",
            "explanation": "PUT is used to update existing resources, while POST is typically used to create new resources."
        },
        {
            "id": "be_3",
            "difficulty": "mid",
            "question": "What is the main purpose of database indexing?",
            "options": [
                "To compress the data stored in the database",
                "To speed up data retrieval operations",
                "To encrypt sensitive data in the database",
                "To ensure data integrity through constraints"
            ],
            "correct_answer": "To speed up data retrieval operations",
            "explanation": "Indexes improve query performance by allowing the database to find data without scanning the entire table."
        },
        {
            "id": "be_4",
            "difficulty": "senior",
            "question": "Which pattern would be most appropriate for handling high-volume, asynchronous tasks in a web application?",
            "options": [
                "Synchronous processing in the request handler",
                "Message queue with worker processes",
                "In-memory data processing only",
                "Multiple database connections per request"
            ],
            "correct_answer": "Message queue with worker processes",
            "explanation": "Message queues allow for asynchronous processing, which can handle high volumes of tasks without blocking the main application."
        }
    ],
    
    # Database
    "database": [
        {
            "id": "db_1",
            "difficulty": "junior",
            "question": "Which of the following is a NoSQL database?",
            "options": ["MySQL", "PostgreSQL", "Oracle", "MongoDB"],
            "correct_answer": "MongoDB",
            "explanation": "MongoDB is a document-oriented NoSQL database, while the others are relational databases."
        },
        {
            "id": "db_2",
            "difficulty": "junior",
            "question": "What does SQL stand for?",
            "options": [
                "Structured Query Language",
                "Simple Question Language",
                "System Quality Linguistics",
                "Sequential Query Lookup"
            ],
            "correct_answer": "Structured Query Language",
            "explanation": "SQL is a standard language for storing, manipulating, and retrieving data in relational databases."
        },
        {
            "id": "db_3",
            "difficulty": "mid",
            "question": "Which of the following is an example of a database transaction property?",
            "options": ["Scalability", "Security", "Atomicity", "Redundancy"],
            "correct_answer": "Atomicity",
            "explanation": "Atomicity is one of the ACID properties, ensuring that database transactions are processed completely or not at all."
        },
        {
            "id": "db_4",
            "difficulty": "senior",
            "question": "What is database sharding?",
            "options": [
                "A backup technique that creates multiple copies of a database",
                "A partitioning strategy that splits a database across multiple servers",
                "A security method that encrypts database columns individually",
                "A normalization technique that removes redundant data"
            ],
            "correct_answer": "A partitioning strategy that splits a database across multiple servers",
            "explanation": "Sharding is a horizontal partitioning method that splits a large database across multiple servers to improve performance and scalability."
        }
    ],
    
    # DevOps and Infrastructure
    "devops": [
        {
            "id": "devops_1",
            "difficulty": "junior",
            "question": "What is the main purpose of container technology like Docker?",
            "options": [
                "To virtualize entire operating systems",
                "To package applications with their dependencies for consistent deployment",
                "To create backups of application data",
                "To optimize database queries"
            ],
            "correct_answer": "To package applications with their dependencies for consistent deployment",
            "explanation": "Containers package code and dependencies together, ensuring consistent operation across different environments."
        },
        {
            "id": "devops_2",
            "difficulty": "junior",
            "question": "What does CI/CD stand for?",
            "options": [
                "Complex Integration/Continuous Deployment",
                "Continuous Integration/Continuous Deployment",
                "Complete Infrastructure/Container Development",
                "Continuous Infrastructure/Complex Delivery"
            ],
            "correct_answer": "Continuous Integration/Continuous Deployment",
            "explanation": "CI/CD refers to the practice of frequently integrating code changes and automating the deployment process."
        },
        {
            "id": "devops_3",
            "difficulty": "mid",
            "question": "Which of the following is NOT a cloud service model?",
            "options": [
                "Infrastructure as a Service (IaaS)",
                "Platform as a Service (PaaS)",
                "Software as a Service (SaaS)",
                "Database as a Service (DBaaS)"
            ],
            "correct_answer": "Database as a Service (DBaaS)",
            "explanation": "While DBaaS exists, it's typically considered a subset of PaaS rather than one of the three main cloud service models."
        },
        {
            "id": "devops_4",
            "difficulty": "senior",
            "question": "Which pattern is best for implementing zero-downtime deployments?",
            "options": [
                "Direct replacement of running instances",
                "Blue-Green deployment",
                "Weekly scheduled maintenance windows",
                "Manual verification of each server"
            ],
            "correct_answer": "Blue-Green deployment",
            "explanation": "Blue-Green deployment maintains two identical environments, allowing for zero-downtime switching between them during updates."
        }
    ]
}

def get_questions_by_difficulty(difficulty_level, count_per_category=1):
    """
    Get a set of questions matching the specified difficulty level.
    
    Parameters:
        difficulty_level: 'junior', 'mid', or 'senior'
        count_per_category: Number of questions to select from each category
        
    Returns:
        List of questions
    """
    selected_questions = []
    
    for category, questions in CS_QUESTIONS.items():
        matching_questions = [q for q in questions if q['difficulty'] == difficulty_level]
        # Take up to count_per_category questions from this category
        selected = matching_questions[:count_per_category]
        selected_questions.extend(selected)
    
    return selected_questions

def get_questions_by_category(category, count=2):
    """
    Get questions from a specific category.
    
    Parameters:
        category: Category to select from
        count: Number of questions to select
        
    Returns:
        List of questions
    """
    if category not in CS_QUESTIONS:
        return []
        
    # Return up to 'count' questions from the category
    return CS_QUESTIONS[category][:count]

def get_assessment_questions(experience_level='junior', matched_skills=None, question_count=10):
    """
    Generate an assessment based on experience level and matched skills.
    
    Parameters:
        experience_level: 'junior', 'mid', or 'senior'
        matched_skills: List of skills found in the candidate's resume
        question_count: Total number of questions to include
        
    Returns:
        List of selected questions
    """
    selected_questions = []
    
    # Map skills to categories
    category_map = {
        "react": "frontend",
        "angular": "frontend",
        "vue": "frontend",
        "html": "frontend",
        "css": "frontend",
        
        "python": "programming",
        "java": "programming",
        "javascript": "programming",
        "c++": "programming",
        "algorithms": "programming",
        "data structures": "programming",
        
        "node.js": "backend",
        "express": "backend",
        "django": "backend",
        "flask": "backend",
        "rest api": "backend",
        
        "sql": "database",
        "mysql": "database",
        "postgresql": "database",
        "mongodb": "database",
        
        "docker": "devops",
        "kubernetes": "devops",
        "aws": "devops",
        "ci/cd": "devops",
        "git": "devops"
    }
    
    # Get some questions based on experience level
    level_questions = get_questions_by_difficulty(experience_level, 1)
    selected_questions.extend(level_questions)
    
    # If we have matched skills, get questions from relevant categories
    if matched_skills:
        # Convert skills to categories
        categories = set()
        for skill in matched_skills:
            if skill in category_map:
                categories.add(category_map[skill])
        
        # Get questions from each category
        for category in categories:
            category_questions = get_questions_by_category(category, 1)
            # Avoid duplicates
            for question in category_questions:
                if question not in selected_questions:
                    selected_questions.append(question)
                    
                    # Stop if we have enough questions
                    if len(selected_questions) >= question_count:
                        break
    
    # If we still need more questions, get them from any category
    while len(selected_questions) < question_count:
        # Get one question from each category until we have enough
        for category in CS_QUESTIONS.keys():
            if len(selected_questions) >= question_count:
                break
                
            category_questions = get_questions_by_category(category, 1)
            # Add a question if not already included
            for question in category_questions:
                if question not in selected_questions:
                    selected_questions.append(question)
                    break
    
    # Return the selected questions, limited to the requested count
    return selected_questions[:question_count]