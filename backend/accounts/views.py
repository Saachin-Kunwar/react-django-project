
from django.contrib.auth import authenticate, get_user_model
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.settings import api_settings
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import RegisterSerializer


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

        if (
            not isinstance(email, str)
            or not email.strip()
            or not isinstance(password, str)
            or not password
        ):
            return Response(
                {"detail": "Email and password are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        account = get_user_model().objects.filter(
            email__iexact=email.strip()
        ).first()

        user = (
            authenticate(
                request,
                email=account.email,
                password=password,
            )
            if account
            else None
        )

        if user is None:
            return Response(
                {"detail": "Invalid email or password."},
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
            max_age=int(
                api_settings.ACCESS_TOKEN_LIFETIME.total_seconds()
            ),
        )

        response.set_cookie(
            key="refresh_token",
            value=str(refresh),
            httponly=True,
            secure=False,
            samesite="Lax",
            max_age=int(
                api_settings.REFRESH_TOKEN_LIFETIME.total_seconds()
            ),
        )

        return response


class RefreshView(APIView):
    # Refresh must work even if the access token has expired.
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        raw_refresh = request.COOKIES.get("refresh_token")

        if not raw_refresh:
            return Response(
                {"detail": "Refresh token is missing. Please log in again."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        try:
            refresh = RefreshToken(raw_refresh)
            access_token = refresh.access_token

            response = Response(
                {"message": "Token refreshed successfully."},
                status=status.HTTP_200_OK,
            )

            response.set_cookie(
                key="access_token",
                value=str(access_token),
                httponly=True,
                secure=False,
                samesite="Lax",
                max_age=int(
                    api_settings.ACCESS_TOKEN_LIFETIME.total_seconds()
                ),
            )

            if api_settings.ROTATE_REFRESH_TOKENS:
                if api_settings.BLACKLIST_AFTER_ROTATION:
                    refresh.blacklist()

                refresh.set_jti()
                refresh.set_exp()
                refresh.set_iat()

                response.set_cookie(
                    key="refresh_token",
                    value=str(refresh),
                    httponly=True,
                    secure=False,
                    samesite="Lax",
                    max_age=int(
                        api_settings.REFRESH_TOKEN_LIFETIME.total_seconds()
                    ),
                )

            return response

        except TokenError:
            response = Response(
                {
                    "detail": (
                        "Refresh token is invalid or expired. "
                        "Please log in again."
                    )
                },
                status=status.HTTP_401_UNAUTHORIZED,
            )
            response.delete_cookie("access_token", samesite="Lax")
            response.delete_cookie("refresh_token", samesite="Lax")
            return response


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        return Response(
            {
                "id": user.id,
                "username": user.username,
                "email": user.email,
            }
        )


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        response = Response(
            {"message": "Logout successful."},
            status=status.HTTP_200_OK,
        )

        response.delete_cookie("access_token", samesite="Lax")
        response.delete_cookie("refresh_token", samesite="Lax")

        return response
