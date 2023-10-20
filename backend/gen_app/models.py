from django.db import models

class Call(models.Model):
    STATUS_CHOICES = [
        ('NORMAL', 'NORMAL'),
        ('URGENT', 'URGENT')
    ]

    # STATE_CHOICES = [
    #     ('Neexecutat', 'Neexecutat'),
    #     ('In executare', 'In executare'),
    #     ('Executat', 'Executat'),
    # ]

    office = models.CharField(max_length=30)
    email_reg = models.CharField(max_length=32)
    name_reg = models.CharField(max_length=32)
    city = models.CharField(max_length=255)
    date_reg = models.CharField(max_length=32)
    sector = models.CharField(max_length=32)
    pt = models.CharField(max_length=64)
    feader = models.CharField(max_length=32)
    account = models.IntegerField()
    name = models.CharField(max_length=255)
    telephone = models.CharField(max_length=32)
    content =  models.CharField(max_length=255)
    status = models.CharField(max_length=32, \
        default='NORMAL', choices=STATUS_CHOICES)
    remark = models.TextField(blank=True)
    state = models.CharField(max_length=64, default='Neexecutat')
    email_ex = models.CharField(max_length=32, blank=True)
    name_ex = models.CharField(max_length=32, blank=True)
    date_ex = models.CharField(max_length=32, blank=True)

    def __str__(self):
        return 'Solicitare ' + str(self.id)
    