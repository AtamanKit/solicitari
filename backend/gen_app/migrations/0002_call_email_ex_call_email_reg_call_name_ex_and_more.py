# Generated by Django 4.0.6 on 2023-01-06 18:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gen_app', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='call',
            name='email_ex',
            field=models.CharField(default=None, max_length=32),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='call',
            name='email_reg',
            field=models.CharField(default=None, max_length=32),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='call',
            name='name_ex',
            field=models.CharField(default=None, max_length=32),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='call',
            name='name_reg',
            field=models.CharField(default=None, max_length=32),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='call',
            name='today',
            field=models.CharField(max_length=32),
        ),
    ]
