from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()

            return Response(
                {
                    "message": "User registered successfully.",
                    "user": {
                        "id": user.id,
                        "username": user.username,
                        "email": user.email,
                    },
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response(
                {
                    "detail": "Email and password are required."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = authenticate(
            request,
            username=email,
            password=password,
        )

        if user is None:
            return Response(
                {
                    "detail": "Invalid email or password."
                },
                status=status.HTTP_401_UNAUTHORIZED,
            )

        refresh = RefreshToken.for_user(user)
        access_token = refresh.access_token

        response = Response(
            {
                "message": "Login successful.",
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                },
            },
            status=status.HTTP_200_OK,
        )

        response.set_cookie(
            key="access_token",
            value=str(access_token),
            httponly=True,
            secure=False,
            samesite="Lax",
            max_age=15 * 60,
        )

        response.set_cookie(
            key="refresh_token",
            value=str(refresh),
            httponly=True,
            secure=False,
            samesite="Lax",
            max_age=7 * 24 * 60 * 60,
        )

        return response

class MeView(APIView):
    permission_classes=[IsAuthenticated]

    def get(self,request):
        user= request.user

        return Response(
            {
                "id":user.id,
                "username":user.username,
                "email":user.email,
            }
        )

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        response = Response(
            {
                "message": "Logout successful."
            },
            status=status.HTTP_200_OK,
        )

        response.delete_cookie("access_token")
        response.delete_cookie("refresh_token")

        return response