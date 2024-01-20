# DUTChecker - Student CheckIn System

## Introduction
- Our program supports student attendance management through facial recognition and user location, using a Client - Server model deployed in a network environment via Raspberry Pi 4.
- The program allows students to mark attendance for classes, view attendance history, chat with others, while teachers can access attendance status and history of students in their classes, chat with students, and admins can manage operations related to courses, users, and attendance history. The system also supports many other small functions to improve the user experience.
- The program involves knowledge of network programming, the TCP/IP model, the Client-Server model, related protocols, DDNS services for remote deployment on Raspberry using the domain: https://dutchecker.ddns.net, SSL and HTTPS configuration to serve secure connections to access the webcam and user location, load balancing knowledge NLB to increase the server's load capacity, optimize the database management system with Connection Pool, and applications of Websocket to help users communicate online and check attendance status in real time.

A detailed technical report of the project can be viewed here: [Technical-Report](https://github.com/tranductri2003/PBL04_DUT_Student-CheckIn-System/blob/main/Technical-Report.pdf).

## How the System Works
### System Overview:
1. **Server**

   URLs directed to the domain dutchecker.ddns.net will be redirected by Nginx to various servers running locally on the Raspberry. This includes two Backend servers running Django code to handle APIs for database queries linked together in a load balancing Cluster, an AI server running Flask code for feature extraction requests to create facial feature data and facial authentication, a WebSocket server running Django code to handle operations related to WebSocket connectivity (chat, attendance, online status), and a Frontend server running ReactJS code to create a user interaction interface for the website.

   - First Backend Server: Uses Django Framework to handle incoming APIs (port 8000) and placed in the NLB backend cluster.
   - Second Backend Server: Uses Django Framework to handle incoming APIs (port 8001) and also placed in the NLB backend cluster.
   - WebSocket Server: Uses Django Framework to handle WebSocket connectivity operations (port 8002).
   - AI Server: Uses Flask Framework to handle feature extraction and facial authentication operations (port 5000).
   - Frontend Server: Uses ReactJS library to create the user interface.

   A comprehensive architecture of the APIs used in our project can be found here: [DUTChecker-API](https://dutchecker.ddns.net/swagger/).

2. **Admin Client**

   The Admin interface can be accessed at [Admin Login URL](https://dutchecker.ddns.net/admin/login/?next=/admin/). This interface provides administrators with comprehensive control over the system. Key functionalities include:

   - **Class Initialization**: Setting up new classes and courses for the academic session.
   - **User Management**: Creating and managing user accounts, including students, teachers, and other staff.
   - **Group and Security Settings**: Establishing different user groups with specific permissions and security settings for data access and system control.
   - **Visual Data Access**: Admins also have the privilege to access the User Client interface for a more visual representation of user data, courses, and detailed attendance history.

3. **User Client**

   The primary interface for teachers and students is available at [DUTChecker Main URL](https://dutchecker.ddns.net/). This user-friendly platform facilitates various educational and administrative tasks:

   - **Real-Time Attendance**: Teachers can mark and manage attendance in real-time, while students can check in for their classes.
   - **Viewing Attendance Status**: Both teachers and students can view real-time attendance status and historical data.
   - **Communication Channel**: The platform provides a means for teachers and students to communicate, including reporting and discussing absences or class-related matters.
   - **Interactive Features**: Additional interactive features to enhance the educational experience.

   For a comprehensive overview of the project, check out the [Summarization Slide](https://github.com/tranductri2003/PBL04_DUT_Student-CheckIn-System/blob/main/Summarization-Slide.pptx).


### How It Works?
- Functions such as querying classes, user information, attendance history, chat history, etc., are performed through the Client-Server model. The backend cluster with two Django servers running at ports 8000 and 8001, connected by a Round-Robin load balancing mechanism, helps reduce server load. Data Connection Pooling is also configured to increase database query efficiency. In addition, an HTTPS upgrade is implemented to allow users to share their Webcam and location (Configuration detailed in the Technical Report). Class Diagrams, Usecases Diagrams, sequences, and database diagrams are also detailed in the Technical Report.

- Functions such as real-time attendance, real-time attendance status, chatting, or online status checking are performed through the TCP/IP model, WebSocket, and Django Channel architecture. The Django server running at port 8002 handles related queries.

- Nginx helps direct URLs called to the Raspberry server and related NLB configurations. Detailed configuration is described in the Technical Report.

- NAT port configuration, DDNS service configuration with the No-IP provider, and Home Default Gateway settings will also be detailed in the Technical Report.

Further details can be found at: [Technical-Report](https://github.com/tranductri2003/PBL04_DUT_Student-CheckIn-System/blob/main/Technical-Report.pdf).

## Installation

We welcome you to install and try out our program.

After cloning this GitHub project, you can set up the environment and .env files as per [sample-env.txt](https://github.com/tranductri2003/PBL04_DUT_Student-CheckIn-System/blob/main/sample-env.txt). This file refers to the .env files corresponding to deployment on LOCALHOST or Raspberry (or EC2).

Sample data for the program can be referenced and imported from [dutchecker.sql](https://github.com/tranductri2003/PBL04_DUT_Student-CheckIn-System/blob/main/dutchecker.sql).

Detailed steps for installation, configuration, and running each server are described in the [Technical-Report](https://github.com/tranductri2003/PBL04_DUT_Student-CheckIn-System/blob/main/Technical-Report.pdf).

Feel free to contact me if you would like to learn more about how to install and deploy this project.

## Future Enhancements

- Improve the accuracy of the AI Server. Currently, I apply basic knowledge of K-Mean and use the VGG16 model for image feature extraction. The challenge in this project is that when creating and saving facial feature data from images, the data obtained from student uploads is relatively small (10-20 images), making the accuracy of extraction and matching still relatively low.
- Improve load balancing, currently, I am setting up basic load balancing with the Round-Robin algorithm, and may try other mechanisms to distribute traffic more efficiently.
- Improve user interface and develop on mobile applications.

## Quick View of the Project
- Account Activation Interface:
![image](https://github.com/tranductri2003/PBL04_DUT_Student-CheckIn-System/assets/89126960/4429fa26-aece-435c-a658-d8173385bbc0)
- User Profile Interface:
![image](https://github.com/tranductri2003/PBL04_DUT_Student-CheckIn-System/assets/89126960/1ee5e79c-0631-40fc-8205-7015287c6f6d)
- Daily Class Schedule Interface:
![image](https://github.com/tranductri2003/PBL04_DUT_Student-CheckIn-System/assets/89126960/be6872bd-2601-4512-bdc3-09bfe2971b3b)
- Attendance History Interface:
![image](https://github.com/tranductri2003/PBL04_DUT_Student-CheckIn-System/assets/89126960/b4aed26e-fcb9-4086-92f1-b749fe4c7d71)
- Attendance Status Interface:
![image](https://github.com/tranductri2003/PBL04_DUT_Student-CheckIn-System/assets/89126960/77b5468a-1a39-4479-aab8-0c8a79df6a32)
- Check-In Interface:
![image](https://github.com/tranductri2003/PBL04_DUT_Student-CheckIn-System/assets/89126960/b934e02b-15dd-428c-b2cf-15b1f8437490)
- Check-In successfully Interface:
![image](https://github.com/tranductri2003/PBL04_DUT_Student-CheckIn-System/assets/89126960/fd7548b8-2c17-469a-88ac-72e5488dbe1c)
- Chat Room Interface:
![image](https://github.com/tranductri2003/PBL04_DUT_Student-CheckIn-System/assets/89126960/a77e402c-8b4e-4c3c-b57a-c8b1081b871b)
