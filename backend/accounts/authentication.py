
from rest_framework.exceptions import PermissionDenied
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.authentication import CSRFCheck


class CookieJWTAuthentication(JWTAuthentication):

    def enforce_csrf(self, request):
        """
        Enforce Django CSRF validation for cookie-authenticated requests.
        """
        check = CSRFCheck(lambda request: None)
        check.process_request(request)

        reason = check.process_view(
            request,
            None,
            (),
            {},
        )

        if reason:
            raise PermissionDenied(f"CSRF Failed: {reason}")

    def authenticate(self, request):
        access_token = request.COOKIES.get("access_token")

        if not access_token:
            return None

        validated_token = self.get_validated_token(access_token)
        user = self.get_user(validated_token)

        # Cookie-based JWT authentication must enforce CSRF.
        self.enforce_csrf(request)

        return user, validated_token
