Assignment 2 - Cloud Services Exercises - Response to Criteria
================================================

Instructions
------------------------------------------------
- Keep this file named A2_response_to_criteria.md, do not change the name
- Upload this file along with your code in the root directory of your project
- Upload this file in the current Markdown format (.md extension)
- Do not delete or rearrange sections.  If you did not attempt a criterion, leave it blank
- Text inside [ ] like [eg. S3 ] are examples and should be removed


Overview
------------------------------------------------

- **Name:** Brian Chang
- **Student number:** n10820566
- **Partner name (if applicable):** N/A
- **Application name:** ClouBirding
- **Two line description:** A website for uploading photos and videos of wildlife observations, which also allows map-based interaction similar to eBird to explore wildlife data in a given area.
- **EC2 instance name or ID:** i-0521f2001c19f649b

(In the Cognito part of the assessment, I was unable to make further progress due to authorization issues (AccessDenied, I can't change into Send email with Amazon SES). However, I did complete part of the code and setup. To avoid blocking the rest of the implementation, I temporarily hard-coded a working username and password to demonstrate the other functionalities.)
(username: testuser password: testpass)

------------------------------------------------

### Core - First data persistence service

- **AWS service name:**  Amazon S3
- **What data is being stored?:** video or picture files
- **Why is this service suited to this data?:** Amazon S3 is designed for storing large, unstructured binary objects such as images and videos.
- **Why is are the other services used not suitable for this data?:**
DynamoDB is optimized for structured key-value or document data, not large binary media.
RDS is a relational database, where storing binary blobs is inefficient, increases storage costs, and reduces query performance.
- **Bucket/instance/table name:** n10820566-cloubirding  
- **Video timestamp:** 1:46 ~ 1:58
- **Relevant files:**
    - Upload.js
    - UploadController.js
    - FileUpload.js
    - S3.js

### Core - Second data persistence service

- **AWS service name:**  DynamoDB
- **What data is being stored?:**  observation id and other observation info(species name, location, time, etc.)
- **Why is this service suited to this data?:** DynamoDB is ideal for storing structured, non-relational metadata at scale.
- **Why is are the other services used not suitable for this data?:**
Amazon S3 is optimized for large binary objects, not querying metadata efficiently.
RDS would require a rigid schema and more overhead for scaling compared to DynamoDB.
- **Bucket/instance/table name:** 10820566CloudBirdingObservations
- **Video timestamp:** 1:33 ~ 1:46
- **Relevant files:**
    - Upload.js
    - ObservationController.js
    - ObservationRoute

### Third data service

- **AWS service name:**  
- **What data is being stored?:** 
- **Why is this service suited to this data?:** 
- **Why is are the other services used not suitable for this data?:** 
- **Bucket/instance/table name:**
- **Video timestamp:**
- **Relevant files:**
    -

### S3 Pre-signed URLs

- **S3 Bucket names:** n10820566-cloubirding
- **Video timestamp:** 1:27 ~ 1:33
- **Relevant files:**
    - S3.js

### In-memory cache

- **ElastiCache instance name:** cloubirding-10820566-cache 
- **What data is being cached?:** Species list (list of all bird/mammal species names in the system), and in the future, cached map views showing aggregated observation records for each location.
- **Why is this data likely to be accessed frequently?:** The species list is repeatedly needed when users create new observations or filter/search data. Map views will also be frequently requested as users explore observation hotspots.
- **Video timestamp:**

- **Relevant files:**
    - (finished code skeleton)
    - memcashed.js
    - ObservationCacheController.js
    - ObservationCacheRoute.js

### Core - Statelessness

- **What data is stored within your application that is not stored in cloud data services?:** None. The application does not contain any local files or session state. All user data, media, and authentication state are stored in cloud services (S3, DynamoDB, and Cognito).
- **Why is this data not considered persistent state?:** Since no data is stored within the container or EC2 instance, there is no persistent state tied to the application runtime. Any container can be stopped, replaced, or restarted without loss of data.
- **How does your application ensure data consistency if the app suddenly stops?:** Data consistency is guaranteed by using cloud-managed services
- **Relevant files:**
    - All the relevant files in Cloud service related sections.

### Graceful handling of persistent connections

- **Type of persistent connection and use:** 
- **Method for handling lost connections:** 
- **Relevant files:**
    -


### Core - Authentication with Cognito

- **User pool name:** 10820566 CloudBirding UserPool
- **How are authentication tokens handled by the client?:** When a user logs in, the backend requests Cognito to initiate authentication and returns an ID token (JWT) to the client.
The client stores the token in localStorage (login.js).
For subsequent API requests, the token is sent in the Authorization header (Bearer <token>).
On the server side, middleware (authenticateToken) validates the JWT with the Cognito JWKS endpoint before granting access.

- **Video timestamp:**  0:36 ~ 1:02

- **Relevant files:**
    - Login.js
    - AuthenticationController.js
    - Authentication.js
    - AuthenticationRoute.js

### Cognito multi-factor authentication

- **What factors are used for authentication:** 
- **Video timestamp:**
- **Relevant files:**
    -

### Cognito federated identities

- **Identity providers used:**
- **Video timestamp:**
- **Relevant files:**
    -

### Cognito groups

- **How are groups used to set permissions?:** 
- **Video timestamp:**
- **Relevant files:**
    -

### Core - DNS with Route53

- **Subdomain**: http://cloubirding.n10820566.cab432.com:8080/
- **Video timestamp:** 0:06 ~ 0:09 , 0:15 ~ 0:19

### Parameter store

- **Parameter names:** /n10820566/cloubirding
- **Video timestamp:** 0:10 ~ 0:14
- **Relevant files:**
    - parameterStore.js
    - app.js

### Secrets manager

- **Secrets names:** 
- **Video timestamp:**
- **Relevant files:**
    -

### Infrastructure as code

- **Technology used:**
- **Services deployed:**
- **Video timestamp:**
- **Relevant files:**
    -

### Other (with prior approval only)

- **Description:**
- **Video timestamp:**
- **Relevant files:**
    -

### Other (with prior permission only)

- **Description:**
- **Video timestamp:**
- **Relevant files:**
    -