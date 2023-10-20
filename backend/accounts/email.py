from djoser.email import (
    ActivationEmail,
    ConfirmationEmail,
)


class ActivationEmail(ActivationEmail):
    template_name = 'email/activation.html'

class ConfirmationEmail(ConfirmationEmail):
    template_name = 'email/confirmation.html'