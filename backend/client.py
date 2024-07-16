import requests

# Define the API endpoints
signup_url = "http://127.0.0.1:8000/api/signup"
login_url = "http://127.0.0.1:8000/api/token"
user_url = "http://127.0.0.1:8000/api/user"
# # # Define the API endpoints
# signup_url = "https://www.queendahyun.com/api/signup"
# login_url = "https://www.queendahyun.com/api/token"
# user_url = "https://www.queendahyun.com/api/user"

# Sample signup for Kim Dahyun
signup_data = {
    "first_name": "Kim",
    "last_name": "Dahyun",
    "date_of_birth": "1998-05-28",
    "gender": "Female",
    "country": "South Korea",
    "email":"kim.dahyunwqsddsa@example.com",
    "password": "aDLkfja231324oisjdf#))(Q$*&#*"
}

signup_response = requests.post(signup_url, json=signup_data)
print("Signup Response:", signup_response.json())

# Sample login for Kim Dahyun
login_data = {
    "username": "kim.dahyunwqsddsa@example.com",  # Change key to 'username' as required by OAuth2PasswordRequestForm
    "password": "aDLkfja231324oisjdf#))(Q$*&#*"
}

login_response = requests.post(login_url, data=login_data)
print("Login Response:", login_response.json())

# Extract the access token from the login response
access_token = login_response.json().get('access_token')

if access_token:
    # Request to get user data
    headers = {
        "Authorization": f"Bearer {access_token}"
    }
    user_response = requests.get(user_url, headers=headers)
    print("User Data Response:", user_response.json())
else:
    print("Login failed, no access token received.")

# import requests
# import json
# from datetime import date

# # Server URL
# BASE_URL = "http://127.0.0.1:8000"

# def signup_password(first_name, last_name, date_of_birth, gender, country, email, password):
#     """Signup with password-based authentication."""
#     url = f"{BASE_URL}/api/signup"
#     data = {
#         "first_name": first_name,
#         "last_name": last_name,
#         "date_of_birth": date_of_birth.isoformat(),
#         "gender": gender,
#         "country": country,
#         "email": email,
#         "password": password
#     }
#     response = requests.post(url, json=data)
#     return response.json()

# def signup_oauth(first_name, last_name, date_of_birth, gender, country, email, oauth_provider, oauth_id):
#     """Signup with OAuth-based authentication."""
#     url = f"{BASE_URL}/api/signup"
#     data = {
#         "first_name": first_name,
#         "last_name": last_name,
#         "date_of_birth": date_of_birth.isoformat(),
#         "gender": gender,
#         "country": country,
#         "email": email,
#         "oauth_provider": oauth_provider,
#         "oauth_id": oauth_id
#     }
#     response = requests.post(url, json=data)
#     return response.json()

# def signin_password(email, password):
#     """Signin with password-based authentication."""
#     url = f"{BASE_URL}/api/login"
#     data = {
#         "email": email,
#         "password": password
#     }
#     response = requests.post(url, json=data)
#     return response.json()

# def signin_oauth(email, oauth_provider, oauth_id):
#     """Signin with OAuth-based authentication."""
#     url = f"{BASE_URL}/api/login"
#     data = {
#         "email": email,
#         "oauth_provider": oauth_provider,
#         "oauth_id": oauth_id
#     }
#     response = requests.post(url, json=data)
#     return response.json()

# def get_user_data(token):
#     """Get user data using JWT token."""
#     url = f"{BASE_URL}/api/user"
#     headers = {"Authorization": f"Bearer {token}"}
#     response = requests.get(url, headers=headers)
#     return response.json()

# if __name__ == "__main__":
#     # Example usage

#     # Signup with password
#     signup_response = signup_password(
#         "John", "Doe", date(1990, 1, 1), "Male", "USA", "john1.doe@example.com", "securepassword123"
#     )
#     print("Signup response:", json.dumps(signup_response, indent=2))

#     # Signin with password
#     signin_response = signin_password("john1.doe@example.com", "securepassword123")
#     print("Signin response:", json.dumps(signin_response, indent=2))

#     if "token" in signin_response:
#         # Get user data
#         user_data = get_user_data(signin_response["token"])
#         print("User data:", json.dumps(user_data, indent=2))












    # # Signup with OAuth
    # oauth_signup_response = signup_oauth(
    #     "Jane", "Doe", date(1995, 5, 5), "Female", "Canada", "jane.doe@example.com", "google", "google_user_id_123"
    # )
    # print("OAuth Signup response:", json.dumps(oauth_signup_response, indent=2))

    # Signin with OAuth
    # oauth_signin_response = signin_oauth("jane.doe@example.com", "google", "google_user_id_123")
    # print("OAuth Signin response:", json.dumps(oauth_signin_response, indent=2))

    # if "token" in oauth_signin_response:
    #     # Get user data for OAuth user
    #     oauth_user_data = get_user_data(oauth_signin_response["token"])
    #     print("OAuth User data:", json.dumps(oauth_user_data, indent=2))