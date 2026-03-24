"""Bridge package so `python -m app.<module>` works from repo root.

This extends the package search path to include backend/app.
"""

from pathlib import Path
import pkgutil

__path__ = pkgutil.extend_path(__path__, __name__)

backend_app_dir = Path(__file__).resolve().parent.parent / "backend" / "app"
if backend_app_dir.is_dir():
    __path__.append(str(backend_app_dir))
