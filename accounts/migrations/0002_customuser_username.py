# Generated by Django 4.2.2 on 2023-06-22 19:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='username',
            field=models.TextField(default='bheta', max_length=16, unique=True),
            preserve_default=False,
        ),
    ]
