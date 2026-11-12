import os
import sys
from pathlib import Path
from datetime import datetime
import argparse


EXCLUDE_DIRS = {'node_modules', 'dist', 'storybook-static', 'build', '.git'}


def is_text_file(path: Path) -> bool:
    try:
        with open(path, 'r', encoding='utf-8') as f:
            f.read(4096)
        return True
    except (UnicodeDecodeError, IOError, OSError):
        return False


def format_size(size: int) -> str:
    for unit in ['B', 'KB', 'MB', 'GB']:
        if size < 1024.0:
            return f"{size:.1f} {unit}"
        size /= 1024.0
    return f"{size:.1f} TB"


def collect_files(root: Path):
    files = []
    for dirpath, dirnames, filenames in os.walk(root):
        # prune excluded dirs in-place
        dirnames[:] = [d for d in dirnames if d not in EXCLUDE_DIRS]
        for name in filenames:
            files.append(Path(dirpath) / name)
    files.sort()
    return files


def generate_tree(root: Path, directory: Path = None, prefix: str = "", depth: int = 0, max_depth: int = 12):
    if directory is None:
        directory = root
    if depth >= max_depth:
        return [f"{prefix}└── ... (max depth)"]

    lines = []
    try:
        entries = sorted(directory.iterdir(), key=lambda p: (p.is_file(), p.name.lower()))
    except PermissionError:
        return lines

    entries = [e for e in entries if e.name not in EXCLUDE_DIRS]

    for i, entry in enumerate(entries):
        last = (i == len(entries) - 1)
        conn = "└── " if last else "├── "
        new_prefix = prefix + ("    " if last else "│   ")
        if entry.is_dir():
            lines.append(f"{prefix}{conn}{entry.name}/")
            lines.extend(generate_tree(root, entry, new_prefix, depth + 1, max_depth))
        else:
            try:
                sz = format_size(entry.stat().st_size)
            except OSError:
                sz = "?"
            lines.append(f"{prefix}{conn}{entry.name} ({sz})")
    return lines


def export(project_root: str, output_file: str, max_depth: int = 12) -> bool:
    root = Path(project_root).resolve()
    out_path = Path(output_file)

    print(f"📂 Scanning: {root}")
    print(f"🚫 Excluding only: {', '.join(EXCLUDE_DIRS)}")

    all_files = collect_files(root)
    print(f"📄 Found {len(all_files)} files")

    total_size = 0
    exported = 0
    skipped_binary = []

    try:
        with open(out_path, "w", encoding="utf-8") as out:
            out.write("=" * 80 + "\n")
            out.write("FULL PROJECT EXPORT\n")
            out.write(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
            out.write(f"Project:   {root.name}\n")
            out.write(f"Path:      {root}\n")
            out.write(f"Excluded:  {', '.join(EXCLUDE_DIRS)}\n")
            out.write("=" * 80 + "\n\n")

            # ---- Tree ----
            out.write("PROJECT STRUCTURE\n")
            out.write("=" * 80 + "\n\n")
            out.write(f"{root.name}/\n")
            for line in generate_tree(root, max_depth=max_depth):
                out.write(line + "\n")
            out.write("\n" + "=" * 80 + "\n\n")

            # ---- Contents ----
            out.write("FILE CONTENTS\n")
            out.write("=" * 80 + "\n\n")

            for i, fpath in enumerate(all_files, 1):
                try:
                    rel = fpath.relative_to(root)
                except ValueError:
                    rel = fpath

                print(f"\r  [{i}/{len(all_files)}] {rel}", end="", flush=True)

                if not is_text_file(fpath):
                    skipped_binary.append(str(rel))
                    continue

                try:
                    content = fpath.read_text(encoding="utf-8", errors="replace")
                    size = len(content.encode("utf-8", errors="replace"))
                except Exception as e:
                    skipped_binary.append(f"{rel} ({e})")
                    continue

                total_size += size
                exported += 1

                out.write(f"\n{'─' * 80}\n")
                out.write(f"FILE: {rel}\n")
                out.write(f"SIZE: {format_size(size)}\n")
                out.write(f"{'─' * 80}\n\n")
                out.write(content)
                if not content.endswith("\n"):
                    out.write("\n")

            # ---- Summary ----
            out.write("\n" + "=" * 80 + "\n")
            out.write("SUMMARY\n")
            out.write("=" * 80 + "\n")
            out.write(f"Files exported:   {exported}\n")
            out.write(f"Files skipped:    {len(skipped_binary)} (binary/unreadable)\n")
            out.write(f"Total text size:  {format_size(total_size)}\n")
            if skipped_binary:
                out.write("\nSkipped files:\n")
                for s in skipped_binary:
                    out.write(f"  • {s}\n")
            out.write("\n" + "=" * 80 + "\nEND OF EXPORT\n" + "=" * 80 + "\n")

    except Exception as e:
        print(f"\n❌ Error: {e}")
        return False

    print(f"\n\n✅ Done. Exported {exported} files → {out_path}")
    print(f"📊 Total text size: {format_size(total_size)}")
    if skipped_binary:
        print(f"⚠️  Skipped {len(skipped_binary)} binary files")
    return True


def main():
    parser = argparse.ArgumentParser(description="Dump every text file (except node_modules)")
    parser.add_argument("-p", "--project", default=".", help="Project root (default: .)")
    parser.add_argument("-o", "--output", default=None, help="Output file")
    parser.add_argument("--max-depth", type=int, default=12, help="Max tree depth")
    args = parser.parse_args()

    project = Path(args.project).resolve()
    out = args.output or f"{project.name.replace(' ', '_').lower()}_export.txt"

    ok = export(str(project), out, max_depth=args.max_depth)
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()