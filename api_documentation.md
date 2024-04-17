#### Create Member (使用者註冊)

- url: localhost:3000/register
- method: POST
- request
  - header
    {
    "Content-Type" : "application/json"
    }
  - body
    {
    "phone": "0912345678",
    "password": "@12345"
    }
- response
  - status code 201
    {
    "message": "Member registered successfully.",
    "member": {
    "id": "f55ad073-f85d-4ffc-9677-9dc074959ded",
    "phone": "0912345678",
    "password": "$2b$10$YoBa.g967HaRzN2UXd2FCeGLqr9k0iPceu/IQNcw2.GCXesaLfQlW",
    "appointmentAmount": 0
    }
    }
  - status code 400 (電話號碼重複)
    {
    "error": "Phone already exists."
    }

#### Login (使用者登入)

- url: localhost:3000/login
- method: POST
- request
  - header
    {
    "Content-Type" : "application/json"
    }
  - body
    {
    "phone": "0912345678",
    "password": "@12345"
    }
- response
  - status code 200
    {
    "message": "You are now logged in."
    }
  - status code 400 (電話號碼未註冊)
    {
    "error": "The phone does not exist."
    }
  - status code 401 (密碼錯誤)
    {
    "error": "Wrong Password."
    }

#### Create patient (建立病患資料)

- url: localhost:3000/createPatient
- method: POST
- request
  - header
    {
    "Content-Type" : "application/json"
    }
  - body
    {
    "memberId": "637e23cc-65e8-4c2f-a65b-a6cbb2a8e8fc",
    "name": "Jamie",
    "patientId": "D123456789",
    "birthday": "2024-04-16",
    "address": "address"
    }
- response
  - status code 201
    {
    "message": "Patient created successfully.",
    "patient": {
    "id": "0e5ed8d7-b25a-4f85-af3f-4d69ab2b0f7d",
    "memberId": "637e23cc-65e8-4c2f-a65b-a6cbb2a8e8fc",
    "name": "Jamie",
    "patientId": "D123456789",
    "birthday": "2024-04-16",
    "address": "address"
    }
    }
  - status code 400 (重複身份證字號)
    {
    "error": "The patient ID already exists."
    }

#### Get patients (取得病患資料列表)

- url: localhost:3000/getPatients/{memberId}
- method: GET
- response
  - status code 200
    [
    {
    "id": "ddaa35f7-e82d-44a5-9e22-8065703bd180",
    "memberId": "637e23cc-65e8-4c2f-a65b-a6cbb2a8e8fc",
    "name": "Jamie",
    "patientId": "U123456789",
    "birthday": "2024-04-16",
    "address": "address",
    "appointmentAmount": 0
    }
    ]
  - status code 404 (該使用者下無病患資料)
    {
    "error": "Patient not found"
    }

#### Create appointment (新增病患預約時段)

- url: localhost:3000/createAppointment
- method: POST
- request
  - header
    {
    "Content-Type" : "application/json"
    }
  - body
    {
    "nationalId": "U123456789",
    "consultationContent": "Not feeling good in my stomach",
    "date": "2024-04-17",
    "time": "14:00 - 15:00"
    }
- response
  - status code 201
    {
    "id": "0629fdf4-2bb6-451c-b722-e1ce651cfc12",
    "patientId": "ddaa35f7-e82d-44a5-9e22-8065703bd180",
    "consultationContent": "Not feeling good in my stomach",
    "date": "2024-04-17",
    "time": "14:00 - 15:00"
    }
  - status code 404
    {
    "error": "Patient not found. Please check the national ID and try again."
    }
  - status code 400 (每位病患最多可預約 2 個時段)
    {
    "error": "You have reached the maximum number (2) of appointments per patient."
    }
  - status code 404
    {
    "error": "Member not found"
    }
  - status code 400 (每位使用者最多可預約 5 個時段)
    {
    "error": "You have reached the maximum number (5) of appointments per member."
    }
