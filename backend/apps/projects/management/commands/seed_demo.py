from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from apps.groups.models import Group
from apps.projects.models import Project, Task

User = get_user_model()

class Command(BaseCommand):
    help = "Seed database with synthetic demo users, cohort groups, projects, and task deliverables."

    def handle(self, *args, **options):
        self.stdout.write("Seeding VEDA portal database...")

        # 1. Admin
        admin, _ = User.objects.get_or_create(
            email="admin@veda.internal",
            defaults={
                "first_name": "Super",
                "last_name": "Admin",
                "role": User.Role.ADMIN,
                "is_staff": True,
                "is_superuser": True,
            },
        )
        admin.set_password("Admin@2026")
        admin.save()

        # 2. Mentors
        mentor_anish, _ = User.objects.get_or_create(
            email="anish.sharma@veda.internal",
            defaults={
                "first_name": "Anish",
                "last_name": "Sharma",
                "role": User.Role.MENTOR,
            },
        )
        mentor_anish.set_password("Mentor@2026")
        mentor_anish.save()

        mentor_ananya, _ = User.objects.get_or_create(
            email="ananya.das@veda.internal",
            defaults={
                "first_name": "Ananya",
                "last_name": "Das",
                "role": User.Role.MENTOR,
            },
        )
        mentor_ananya.set_password("Mentor@2026")
        mentor_ananya.save()

        # 3. Interns
        intern_aarav, _ = User.objects.get_or_create(
            email="aarav.mehta@veda.internal",
            defaults={
                "first_name": "Aarav",
                "last_name": "Mehta",
                "role": User.Role.INTERN,
            },
        )
        intern_aarav.set_password("Intern@2026")
        intern_aarav.save()

        intern_priya, _ = User.objects.get_or_create(
            email="priya.nair@veda.internal",
            defaults={
                "first_name": "Priya",
                "last_name": "Nair",
                "role": User.Role.INTERN,
            },
        )
        intern_priya.set_password("Intern@2026")
        intern_priya.save()

        intern_kabir, _ = User.objects.get_or_create(
            email="kabir.singh@veda.internal",
            defaults={
                "first_name": "Kabir",
                "last_name": "Singh",
                "role": User.Role.INTERN,
            },
        )
        intern_kabir.set_password("Intern@2026")
        intern_kabir.save()

        intern_aditi, _ = User.objects.get_or_create(
            email="aditi.sharma@veda.internal",
            defaults={
                "first_name": "Aditi",
                "last_name": "Sharma",
                "role": User.Role.INTERN,
            },
        )
        intern_aditi.set_password("Intern@2026")
        intern_aditi.save()

        # 4. Groups
        group1, _ = Group.objects.get_or_create(
            code="VEDA-01",
            defaults={
                "name": "Machine Learning & Baseline AI Cohort",
                "mentor": mentor_anish,
            },
        )
        group1.mentor = mentor_anish
        group1.interns.set([intern_aarav, intern_priya])
        group1.save()

        group2, _ = Group.objects.get_or_create(
            code="VEDA-02",
            defaults={
                "name": "Data Engineering & NLP Cohort",
                "mentor": mentor_ananya,
            },
        )
        group2.mentor = mentor_ananya
        group2.interns.set([intern_kabir, intern_aditi])
        group2.save()

        # 5. Projects
        p1, _ = Project.objects.get_or_create(
            group=group1,
            title="Baseline ML Project",
            defaults={
                "problem_statement": "Build and evaluate an end-to-end reproducible machine learning baseline pipeline on tabular and temporal medical diagnostic benchmarks, complete with versioned data pipelines and validation metric logging.",
                "expected_final_output": "A production-ready GitHub repository containing clean modular Python packages, Dockerized reproducible evaluation scripts, unit tests, and comprehensive benchmark documentation.",
            },
        )

        p2, _ = Project.objects.get_or_create(
            group=group2,
            title="NLP Clinical Analytics",
            defaults={
                "problem_statement": "Develop a fine-tuned transformer model for clinical text classification and Named Entity Recognition with active learning human-in-the-loop validation.",
                "expected_final_output": "Fine-tuned Hugging Face model pipeline, evaluation benchmarks, and interactive Streamlit or FastAPI demo endpoint.",
            },
        )

        # 6. Tasks
        Task.objects.get_or_create(
            project=p1,
            number=1,
            defaults={
                "title": "Task 1: EDA & Repository Setup",
                "description": "Initialize project repository with poetry/pip-tools, linters, pre-commit hooks, and conduct exploratory data analysis on the diagnostic dataset.",
                "expected_output": "GitHub repository link with formatted EDA Jupyter notebooks and data summary tables.",
                "due_date": "2026-10-25",
            },
        )

        Task.objects.get_or_create(
            project=p1,
            number=2,
            defaults={
                "title": "Task 2: Data Preparation & Modeling",
                "description": "Build feature transformation pipelines and train baseline classification models (LightGBM, Random Forest, Logistic Regression).",
                "expected_output": "Clean scikit-learn pipeline scripts and cross-validation performance report.",
                "due_date": "2026-11-02",
            },
        )

        Task.objects.get_or_create(
            project=p2,
            number=1,
            defaults={
                "title": "Task 1: Dataset Tokenization & Baseline Transformer",
                "description": "Preprocess clinical annotation corpus, train tokenizer, and establish zero-shot transformer benchmarks.",
                "expected_output": "Evaluation metrics table and reproducible tokenization pipeline script.",
                "due_date": "2026-10-28",
            },
        )

        self.stdout.write(self.style.SUCCESS("Database seeded successfully with groups, projects, tasks, and users!"))
