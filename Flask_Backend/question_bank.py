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
    
    # Data Structures
    "data_structures": [
        {
            "id": "ds_1",
            "difficulty": "junior",
            "question": "Which data structure operates on a First-In-First-Out (FIFO) principle?",
            "options": ["Stack", "Queue", "Binary Tree", "Hash Table"],
            "correct_answer": "Queue",
            "explanation": "A queue follows the FIFO principle where the first element added is the first one to be removed."
        },
        {
            "id": "ds_2",
            "difficulty": "junior",
            "question": "What is the time complexity of searching for an element in a balanced binary search tree?",
            "options": ["O(1)", "O(log n)", "O(n)", "O(n²)"],
            "correct_answer": "O(log n)",
            "explanation": "A balanced binary search tree divides the search space in half at each step, resulting in logarithmic time complexity."
        },
        {
            "id": "ds_3",
            "difficulty": "mid",
            "question": "Which of the following data structures would be most efficient for implementing a dictionary with frequent lookups?",
            "options": ["Array", "Linked List", "Hash Table", "Stack"],
            "correct_answer": "Hash Table",
            "explanation": "Hash tables provide O(1) average-case time complexity for lookups, making them ideal for dictionary implementations."
        },
        {
            "id": "ds_4",
            "difficulty": "senior",
            "question": "Which data structure would be most appropriate for efficiently finding the k-th smallest element in a large dataset?",
            "options": ["Sorted Array", "Min Heap", "Hash Table", "Linked List"],
            "correct_answer": "Min Heap",
            "explanation": "A min heap can efficiently track the k smallest elements seen so far, making it optimal for this problem."
        }
    ],
    
    # Algorithms
    "algorithms": [
        {
            "id": "algo_1",
            "difficulty": "junior",
            "question": "What is the primary advantage of a binary search over a linear search?",
            "options": [
                "It works on unsorted data",
                "It has O(log n) time complexity instead of O(n)",
                "It requires less memory",
                "It is easier to implement"
            ],
            "correct_answer": "It has O(log n) time complexity instead of O(n)",
            "explanation": "Binary search is more efficient with O(log n) time complexity, but requires sorted data."
        },
        {
            "id": "algo_2",
            "difficulty": "junior",
            "question": "Which sorting algorithm has the best average-case time complexity?",
            "options": ["Bubble Sort", "Insertion Sort", "Merge Sort", "Selection Sort"],
            "correct_answer": "Merge Sort",
            "explanation": "Merge Sort has an average-case time complexity of O(n log n), which is optimal for comparison-based sorting algorithms."
        },
        {
            "id": "algo_3",
            "difficulty": "mid",
            "question": "What is the purpose of dynamic programming?",
            "options": [
                "To parallelize algorithms across multiple processors",
                "To solve problems by breaking them down into simpler overlapping subproblems",
                "To dynamically allocate memory during program execution",
                "To create self-modifying code"
            ],
            "correct_answer": "To solve problems by breaking them down into simpler overlapping subproblems",
            "explanation": "Dynamic programming optimizes recursive solutions by storing results of subproblems to avoid redundant calculations."
        },
        {
            "id": "algo_4",
            "difficulty": "senior",
            "question": "Which algorithm would be most appropriate for finding the shortest path in a graph with negative edge weights?",
            "options": ["Dijkstra's Algorithm", "Bellman-Ford Algorithm", "A* Search", "Breadth-First Search"],
            "correct_answer": "Bellman-Ford Algorithm",
            "explanation": "Unlike Dijkstra's algorithm, Bellman-Ford can handle graphs with negative edge weights and can detect negative cycles."
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
    
    # Web Development - Full Stack
    "fullstack": [
        {
            "id": "fs_1",
            "difficulty": "junior",
            "question": "What does CORS stand for in web development?",
            "options": [
                "Cross-Origin Resource Sharing",
                "Content Origin Resource Server",
                "Cross-Object Response System",
                "Content-Oriented Response Service"
            ],
            "correct_answer": "Cross-Origin Resource Sharing",
            "explanation": "CORS is a security feature that allows or restricts web applications running at one origin to request resources from a different origin."
        },
        {
            "id": "fs_2",
            "difficulty": "junior",
            "question": "Which of the following is NOT a common HTTP request method?",
            "options": ["GET", "POST", "SEND", "DELETE"],
            "correct_answer": "SEND",
            "explanation": "SEND is not a standard HTTP method. The common methods include GET, POST, PUT, DELETE, PATCH, and OPTIONS."
        },
        {
            "id": "fs_3",
            "difficulty": "mid",
            "question": "What is the purpose of a web API gateway?",
            "options": [
                "To block unauthorized web traffic",
                "To serve as a single entry point for multiple microservices",
                "To increase database query performance",
                "To compress web content for faster loading"
            ],
            "correct_answer": "To serve as a single entry point for multiple microservices",
            "explanation": "An API gateway acts as a reverse proxy, routing requests to appropriate services and handling cross-cutting concerns like authentication."
        },
        {
            "id": "fs_4",
            "difficulty": "senior",
            "question": "Which pattern would be most appropriate for handling real-time updates in a web application?",
            "options": [
                "Request-Response Pattern",
                "Publish-Subscribe Pattern",
                "Batch Processing Pattern",
                "Circuit Breaker Pattern"
            ],
            "correct_answer": "Publish-Subscribe Pattern",
            "explanation": "The Publish-Subscribe pattern allows for real-time updates by having clients subscribe to events and receiving notifications when events occur."
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
    
    # Mobile Development
    "mobile": [
        {
            "id": "mob_1",
            "difficulty": "junior",
            "question": "Which programming language is primarily used for native iOS app development?",
            "options": ["Java", "Kotlin", "Swift", "C#"],
            "correct_answer": "Swift",
            "explanation": "Swift is Apple's preferred language for iOS development, replacing Objective-C as the primary language."
        },
        {
            "id": "mob_2",
            "difficulty": "junior",
            "question": "What is the purpose of responsive design in mobile development?",
            "options": [
                "To make apps respond faster to user input",
                "To adapt the layout to different screen sizes and orientations",
                "To reduce the app's memory footprint",
                "To enable push notifications"
            ],
            "correct_answer": "To adapt the layout to different screen sizes and orientations",
            "explanation": "Responsive design ensures that applications look and function well across a variety of devices and screen sizes."
        },
        {
            "id": "mob_3",
            "difficulty": "mid",
            "question": "What is the main advantage of using React Native for mobile development?",
            "options": [
                "It compiles to completely native code for maximum performance",
                "It allows sharing code between iOS and Android platforms",
                "It provides deeper access to hardware features than native development",
                "It requires less memory than native applications"
            ],
            "correct_answer": "It allows sharing code between iOS and Android platforms",
            "explanation": "React Native enables developers to write once and deploy to multiple platforms, significantly reducing development time."
        },
        {
            "id": "mob_4",
            "difficulty": "senior",
            "question": "Which mobile app architecture pattern separates the app into three components: Model, View, and Intent?",
            "options": ["MVC", "MVP", "MVVM", "MVI"],
            "correct_answer": "MVI",
            "explanation": "Model-View-Intent is a unidirectional architecture pattern that emphasizes a single source of truth and immutable state."
        }
    ],
    
    # Machine Learning
    "machine_learning": [
        {
            "id": "ml_1",
            "difficulty": "junior",
            "question": "Which of the following is NOT a type of machine learning?",
            "options": ["Supervised Learning", "Unsupervised Learning", "Deterministic Learning", "Reinforcement Learning"],
            "correct_answer": "Deterministic Learning",
            "explanation": "Deterministic Learning is not a standard type of machine learning. The main types are supervised, unsupervised, and reinforcement learning."
        },
        {
            "id": "ml_2",
            "difficulty": "junior",
            "question": "What is the primary purpose of the training dataset in supervised learning?",
            "options": [
                "To test the model's performance",
                "To provide examples for the model to learn from",
                "To validate hyperparameter choices",
                "To determine the learning rate"
            ],
            "correct_answer": "To provide examples for the model to learn from",
            "explanation": "The training dataset contains labeled examples that the model uses to learn the relationships between features and target variables."
        },
        {
            "id": "ml_3",
            "difficulty": "mid",
            "question": "Which technique is used to prevent overfitting in machine learning models?",
            "options": ["Data augmentation", "Gradient descent", "Feature engineering", "Regularization"],
            "correct_answer": "Regularization",
            "explanation": "Regularization adds a penalty term to the loss function to discourage complex models, helping prevent overfitting to the training data."
        },
        {
            "id": "ml_4",
            "difficulty": "senior",
            "question": "Which algorithm would be most appropriate for a recommender system with millions of users and items?",
            "options": ["Decision Trees", "Naive Bayes", "Matrix Factorization", "K-means Clustering"],
            "correct_answer": "Matrix Factorization",
            "explanation": "Matrix factorization techniques like SVD can efficiently handle large-scale recommender systems by decomposing the user-item interaction matrix."
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
    ],
    
    # Cloud Computing
    "cloud": [
        {
            "id": "cloud_1",
            "difficulty": "junior",
            "question": "What is the primary benefit of auto-scaling in cloud environments?",
            "options": [
                "It automatically updates software versions",
                "It adjusts resources based on demand",
                "It reduces security vulnerabilities",
                "It optimizes database queries"
            ],
            "correct_answer": "It adjusts resources based on demand",
            "explanation": "Auto-scaling dynamically adjusts the number of resources (such as instances) to match the current demand, optimizing performance and cost."
        },
        {
            "id": "cloud_2",
            "difficulty": "junior",
            "question": "Which of the following is NOT a major cloud service provider?",
            "options": ["Amazon Web Services (AWS)", "Microsoft Azure", "Google Cloud Platform (GCP)", "Oracle Database (ODB)"],
            "correct_answer": "Oracle Database (ODB)",
            "explanation": "Oracle Database is a database product, not a cloud service provider. Oracle Cloud is their cloud platform."
        },
        {
            "id": "cloud_3",
            "difficulty": "mid",
            "question": "What is the difference between IaaS and PaaS?",
            "options": [
                "IaaS provides infrastructure while PaaS provides a development platform",
                "IaaS is internet-based while PaaS is private",
                "IaaS is for internal users while PaaS is for public access",
                "IaaS focuses on storage while PaaS focuses on compute"
            ],
            "correct_answer": "IaaS provides infrastructure while PaaS provides a development platform",
            "explanation": "IaaS (Infrastructure as a Service) provides virtualized computing resources, while PaaS (Platform as a Service) provides a platform for developing, running, and managing applications."
        },
        {
            "id": "cloud_4",
            "difficulty": "senior",
            "question": "Which cloud deployment pattern is best for applications that need to continue functioning during cloud provider outages?",
            "options": [
                "Multi-AZ deployment",
                "Blue-green deployment",
                "Multi-region deployment",
                "Multi-cloud deployment"
            ],
            "correct_answer": "Multi-cloud deployment",
            "explanation": "Multi-cloud deployment distributes applications across multiple cloud providers, ensuring resilience against a single provider's outage."
        }
    ],
    
    # Security
    "security": [
        {
            "id": "sec_1",
            "difficulty": "junior",
            "question": "What is the purpose of HTTPS?",
            "options": [
                "To speed up web browsing",
                "To encrypt data transmitted between client and server",
                "To compress web content",
                "To block malicious websites"
            ],
            "correct_answer": "To encrypt data transmitted between client and server",
            "explanation": "HTTPS (HTTP Secure) uses TLS/SSL encryption to secure the communication between web browsers and servers."
        },
        {
            "id": "sec_2",
            "difficulty": "junior",
            "question": "Which of the following is NOT a common type of web security vulnerability?",
            "options": ["SQL Injection", "Cross-Site Scripting (XSS)", "Random Access Manipulation (RAM)", "Cross-Site Request Forgery (CSRF)"],
            "correct_answer": "Random Access Manipulation (RAM)",
            "explanation": "Random Access Manipulation is not a standard security vulnerability term. The others are well-known web security vulnerabilities."
        },
        {
            "id": "sec_3",
            "difficulty": "mid",
            "question": "What is the principle of least privilege in security?",
            "options": [
                "Users should have minimal documentation about security features",
                "Security measures should be as unobtrusive as possible",
                "Users should be granted only the permissions they need to perform their tasks",
                "Security should focus on the least critical systems first"
            ],
            "correct_answer": "Users should be granted only the permissions they need to perform their tasks",
            "explanation": "The principle of least privilege states that users or processes should have only the minimum levels of access necessary to complete their job functions."
        },
        {
            "id": "sec_4",
            "difficulty": "senior",
            "question": "Which cryptographic attack attempts to find a message that produces the same hash value as another message?",
            "options": ["Brute Force Attack", "Dictionary Attack", "Collision Attack", "Man-in-the-Middle Attack"],
            "correct_answer": "Collision Attack",
            "explanation": "A collision attack focuses on finding two different inputs that produce the same hash output, which can compromise cryptographic hash functions."
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
        "data structures": "data_structures",
        
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
        "aws": "cloud",
        "azure": "cloud",
        "gcp": "cloud",
        "ci/cd": "devops",
        "git": "devops",
        
        "machine learning": "machine_learning",
        "ai": "machine_learning",
        "deep learning": "machine_learning",
        
        "ios": "mobile",
        "android": "mobile",
        "swift": "mobile",
        "kotlin": "mobile",
        "react native": "mobile",
        "flutter": "mobile",
        
        "security": "security",
        "encryption": "security",
        "authentication": "security",
        
        "fullstack": "fullstack",
        "full stack": "fullstack"
    }
    
    # Get some questions based on experience level
    level_questions = get_questions_by_difficulty(experience_level, 1)
    selected_questions.extend(level_questions)
    
    # If we have matched skills, get questions from relevant categories
    if matched_skills:
        # Convert skills to categories
        categories = set()
        for skill in matched_skills:
            if skill.lower() in category_map:
                categories.add(category_map[skill.lower()])
        
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