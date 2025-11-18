The EdTech Task Manager is a secure MERN stack application that solves the Student-Teacher access control challenge. 
It features RBAC, JWT auth, and complex API query logic to ensure accurate role-based task visibility and management.

//Project Structure
/client     → React frontend  
/server     → Node + Express backend

//Frontend and Backend setup
1. Download MongoDB and MongoDB compass on the desktop
2. Download the frontend and backend to a folder named `edtech_task_manager`
3. Open powershell (run as administrator) navigate to frontend, similarly another powershell for backend file
4. Run the commands `net start MongoDB` and `npm run dev` in backend powershell
5. Run the command `npm start` to connect.

//Role Functionality
The application supports two roles:
Student
Teacher

//Student Features
1. Login / Signup
2. View tasks assigned to their role
3. Add their own tasks
4. Update task status
5. Delete their own tasks

//Teacher Features
1. Login / Signup
2. Add tasks for students
3. View all tasks created by students
4. Delete any task
5. Cannot modify student credentials
6. Teachers get a different background picture automatically
7. Teacher Task-View Logic

//Teachers should be able to see:
1. Tasks created by all students
2. Tasks assigned by the teacher
3. Status of each task
4. Email and role of the task owner

//How It Works 
1. Authentication is stored locally using readAuth(), saveAuth(), and clearAuth().
2. Role-based background images and dashboards depend on auth.role.
3. No router is used; instead, the app switches views using internal state (login, signup, dashboard).

//Video link
https://drive.google.com/file/d/1Hi6JOiTFw4XJVGWBUD9wxtSKZ6El2hOQ/view?usp=drive_link
