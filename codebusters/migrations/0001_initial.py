# Generated by Django 4.2.2 on 2023-06-22 20:12

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Quote',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('text', models.CharField(max_length=512)),
                ('num_solves', models.BigIntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='Solve',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('time_solved', models.DecimalField(decimal_places=3, max_digits=7)),
                ('solve_datetime', models.DateTimeField()),
                ('quote_id', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='codebusters.quote')),
                ('solver_id', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
