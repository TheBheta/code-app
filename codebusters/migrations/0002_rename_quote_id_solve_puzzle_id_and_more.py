# Generated by Django 4.2.2 on 2023-06-23 22:12

from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('codebusters', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='solve',
            old_name='quote_id',
            new_name='puzzle_id',
        ),
        migrations.AlterField(
            model_name='quote',
            name='num_solves',
            field=models.BigIntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='quote',
            name='text',
            field=models.CharField(max_length=512, unique=True),
        ),
        migrations.CreateModel(
            name='Puzzle',
            fields=[
                ('puzzle_id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('puzzle_type', models.CharField(max_length=32)),
                ('encrypted_text', models.CharField(max_length=512)),
                ('solution_text', models.CharField(max_length=512)),
                ('key', models.CharField(max_length=512)),
                ('creation_datetime', models.DateTimeField(auto_now=True)),
                ('quote_id', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='codebusters.quote')),
            ],
        ),
    ]
