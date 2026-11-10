import os
import sys
import hashlib
from pathlib import Path
from datetime import datetime
from collections import defaultdict
from typing import List, Dict, Optional, Set
import argparse


class AdvancedProjectExporter:
    
    CODE_EXTENSIONS = {
        '.py', '.js', '.jsx', '.ts', '.tsx', '.html', '.css', '.scss', '.sass',
        '.less', '.json', '.xml', '.yaml', '.yml', '.md', '.mdx', '.txt', '.env',
        '.gitignore', '.editorconfig', '.sh', '.bash', '.zsh', '.fish',
        '.ps1', '.bat', '.cmd', '.php', '.rb', '.go', '.rs', '.java',
        '.kt', '.swift', '.c', '.cpp', '.h', '.hpp', '.cs', '.fs', '.vb',
        '.sql', '.graphql', '.gql', '.proto', '.toml', '.ini', '.cfg',
        '.conf', '.lock', '.svg', '.vue', '.svelte', '.glsl', '.vert',
        '.frag', '.comp', '.rpc', '.mjs', '.cjs', '.mts', '.cts',
        '.stories.js', '.stories.jsx', '.stories.ts', '.stories.tsx',
        '.story.js', '.story.jsx', '.story.ts', '.story.tsx',
    }
    
    ALLOWED_FILENAMES = {
        '.gitignore', '.env', '.env.example', '.env.local', '.env.development',
        '.env.production', '.env.test', '.editorconfig', '.eslintrc',
        '.eslintrc.js', '.eslintrc.json', '.eslintrc.cjs', '.prettierrc',
        '.prettierrc.js', '.prettierrc.cjs', '.prettierrc.json', '.prettierignore',
        '.npmrc', '.nvmrc', '.babelrc', '.browserslistrc', '.gitattributes',
        'README', 'README.md', 'LICENSE', 'LICENSE.md', 'Makefile', 'Dockerfile',
        'CHANGELOG', 'CHANGELOG.md', 'CONTRIBUTING', 'CONTRIBUTING.md',
        # Root / Storybook config
        'main.js', 'main.ts', 'main.mjs', 'main.cjs',
        'preview.js', 'preview.ts', 'preview.mjs', 'preview.cjs',
        'preview-head.html', 'preview-body.html',
        'manager.js', 'manager.ts', 'manager.mjs', 'manager.cjs',
        'manager-head.html', 'middleware.js', 'middleware.ts',
        'addon.js', 'addon.ts', 'preset.js', 'preset.ts',
        'index.js', 'index.ts', 'index.mjs', 'index.cjs',
    }
    
    EXCLUDE_DIRS = {
        'node_modules', 'venv', '.venv', 'env', '.env', 'virtualenv',
        '__pycache__', '.git', '.svn', '.hg', '.idea', '.vscode',
        'dist', 'build', 'target', 'out', '.next', '.nuxt',
        'coverage', '.pytest_cache', '.mypy_cache', '.tox',
        'egg-info', '.eggs', 'pip-wheel-metadata',
        'vendor', 'bower_components', '.parcel-cache',
        '.turbo', '.serverless', 'cdk.out', '.cache',
    }
    
    EXCLUDE_FILES = {
        '.DS_Store', 'Thumbs.db', 'desktop.ini',
        'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml',
        'Cargo.lock', 'Gemfile.lock', 'poetry.lock',
        '.eslintcache', '.prettiercache',
    }
    
    def __init__(self, project_root: str = '.', output_file: str = None, 
                 max_file_size: int = None, max_lines_per_file: int = None,
                 include_patterns: List[str] = None, exclude_patterns: List[str] = None,
                 truncate_large_files: bool = False, include_all: bool = False):
        self.project_root = Path(project_root).resolve()
        self.output_file = Path(output_file) if output_file else self._generate_output_name()
        self.file_count = 0
        self.total_size = 0
        self.stats = defaultdict(int)
        self.file_hashes = {}
        self.skipped_files = []
        self.truncated_files = []
        
        self.max_file_size = max_file_size or 500 * 1024
        self.max_lines_per_file = max_lines_per_file or 1000
        self.truncate_large_files = truncate_large_files
        self.include_all = include_all
        self.include_patterns = [] if include_all else (include_patterns or ['src', '.storybook'])
        self.exclude_patterns = exclude_patterns or []
        
    def _generate_output_name(self) -> Path:
        project_name = self.project_root.name.replace(' ', '_').lower()
        return Path(f"{project_name}_export.txt")
    
    def _normalize_path(self, path_str: str) -> str:
        return path_str.replace('\\', '/')
    
    def _path_matches_include(self, rel_str: str) -> bool:
        if not self.include_patterns:
            return True
        rel_str = self._normalize_path(rel_str)
        for pattern in self.include_patterns:
            pattern_norm = self._normalize_path(pattern).strip('/')
            if not pattern_norm:
                continue
            if (rel_str == pattern_norm
                    or rel_str.startswith(pattern_norm + '/')):
                return True
        return False
    
    def should_include_file(self, file_path: Path) -> bool:
        """Enhanced file inclusion check with size and pattern filters."""
        if not file_path.is_file():
            return False
        
        if file_path.name in self.EXCLUDE_FILES:
            return False
        
        for parent in file_path.parents:
            if parent.name in self.EXCLUDE_DIRS:
                return False
        
        # Include-pattern filter — but ALWAYS allow root-level files
        # (package.json, index.html, vite.config.ts, tsconfig.json, ...)
        try:
            relative_path = file_path.relative_to(self.project_root)
            rel_str = self._normalize_path(str(relative_path))
            is_root_file = ('/' not in rel_str)
            if not is_root_file and not self._path_matches_include(rel_str):
                return False
        except ValueError:
            return False
        
        if self.exclude_patterns:
            full_str = self._normalize_path(str(file_path))
            for pattern in self.exclude_patterns:
                if self._normalize_path(pattern) in full_str:
                    return False
        
        try:
            file_size = file_path.stat().st_size
            if file_size > self.max_file_size:
                if self.truncate_large_files:
                    self.truncated_files.append(str(file_path))
                    return True
                else:
                    self.skipped_files.append(f"{file_path} (size: {file_size} bytes)")
                    return False
        except OSError:
            return False
        
        if file_path.name in self.ALLOWED_FILENAMES:
            return self._is_text_readable(file_path)
        
        if file_path.suffix.lower() in self.CODE_EXTENSIONS:
            return self._is_text_readable(file_path)
        
        return False
    
    def _is_text_readable(self, file_path: Path) -> bool:
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                f.read(1024)
            return True
        except (UnicodeDecodeError, IOError):
            return False
    
    def generate_tree(self, directory: Path = None, prefix: str = '', 
                     max_depth: int = 10, current_depth: int = 0) -> List[str]:
        if directory is None:
            directory = self.project_root
        
        if current_depth >= max_depth:
            return [f"{prefix}└── ... (max depth reached)"]
        
        tree_lines = []
        entries = []
        
        try:
            for entry in sorted(directory.iterdir()):
                if entry.name in self.EXCLUDE_DIRS:
                    continue
                
                if entry.is_dir() and entry.name.startswith('.'):
                    if entry.name not in self.include_patterns:
                        continue
                
                if entry.is_file() and not self.should_include_file(entry):
                    continue
                
                entries.append(entry)
        except PermissionError:
            return tree_lines
        
        for i, entry in enumerate(entries):
            is_last_entry = (i == len(entries) - 1)
            connector = '└── ' if is_last_entry else '├── '
            new_prefix = prefix + ('    ' if is_last_entry else '│   ')
            
            if entry.is_dir():
                tree_lines.append(f"{prefix}{connector}{entry.name}/")
                tree_lines.extend(
                    self.generate_tree(entry, new_prefix, max_depth, current_depth + 1)
                )
            else:
                try:
                    size = entry.stat().st_size
                except OSError:
                    size = 0
                size_str = self._format_size(size)
                tree_lines.append(f"{prefix}{connector}{entry.name} ({size_str})")
        
        return tree_lines
    
    def _format_size(self, size: int) -> str:
        for unit in ['B', 'KB', 'MB', 'GB']:
            if size < 1024.0:
                return f"{size:.1f} {unit}"
            size /= 1024.0
        return f"{size:.1f} TB"
    
    def _calculate_hash(self, content: str) -> str:
        return hashlib.sha256(content.encode('utf-8')).hexdigest()[:8]
    
    def _count_lines_of_code(self, content: str, language: str) -> Dict[str, int]:
        lines = content.split('\n')
        total_lines = len(lines)
        blank_lines = len([l for l in lines if not l.strip()])
        
        comment_patterns = {
            'python': '#', 'javascript': '//', 'typescript': '//',
            'jsx': '//', 'tsx': '//', 'css': '/*', 'html': '<!--',
            'bash': '#', 'sql': '--', 'yaml': '#',
        }
        
        comment_prefix = comment_patterns.get(language, '#')
        comment_lines = len([l for l in lines if l.strip().startswith(comment_prefix)])
        code_lines = total_lines - blank_lines - comment_lines
        
        return {'total': total_lines, 'code': code_lines,
                'blank': blank_lines, 'comment': comment_lines}
    
    def read_file_content(self, file_path: Path) -> Optional[str]:
        encodings = ['utf-8', 'latin-1', 'cp1252', 'iso-8859-1', 'ascii']
        
        for encoding in encodings:
            try:
                file_size = file_path.stat().st_size
                if file_size > self.max_file_size and self.truncate_large_files:
                    with open(file_path, 'r', encoding=encoding) as f:
                        lines = []
                        line_count = 0
                        for line in f:
                            if line_count >= self.max_lines_per_file:
                                lines.append(f"\n... (content truncated after {self.max_lines_per_file} lines)\n")
                                lines.append(f"Original file size: {file_size:,} bytes\n")
                                break
                            lines.append(line)
                            line_count += 1
                        content = ''.join(lines)
                        file_hash = self._calculate_hash(content)
                        self.file_hashes[str(file_path.relative_to(self.project_root))] = file_hash
                        return content
                else:
                    with open(file_path, 'r', encoding=encoding) as f:
                        content = f.read()
                    
                    lines = content.split('\n')
                    if len(lines) > self.max_lines_per_file and self.truncate_large_files:
                        truncated_content = '\n'.join(lines[:self.max_lines_per_file])
                        truncated_content += f"\n\n... (content truncated after {self.max_lines_per_file} lines)\n"
                        truncated_content += f"Original file had {len(lines)} lines\n"
                        content = truncated_content
                        self.truncated_files.append(str(file_path))
                    
                    file_hash = self._calculate_hash(content)
                    self.file_hashes[str(file_path.relative_to(self.project_root))] = file_hash
                    return content
                    
            except UnicodeDecodeError:
                continue
            except Exception:
                return None
        
        return None
    
    def get_file_language(self, file_path: Path) -> str:
        extension_map = {
            '.py': 'python', '.js': 'javascript', '.jsx': 'jsx',
            '.ts': 'typescript', '.tsx': 'tsx', '.mjs': 'javascript',
            '.cjs': 'javascript', '.mts': 'typescript', '.cts': 'typescript',
            '.html': 'html', '.css': 'css', '.scss': 'scss', '.sass': 'sass',
            '.less': 'less', '.json': 'json', '.xml': 'xml', '.yaml': 'yaml',
            '.yml': 'yaml', '.md': 'markdown', '.mdx': 'mdx', '.sh': 'bash',
            '.bash': 'bash', '.zsh': 'bash', '.ps1': 'powershell', '.bat': 'batch',
            '.sql': 'sql', '.graphql': 'graphql', '.gql': 'graphql', '.java': 'java',
            '.kt': 'kotlin', '.swift': 'swift', '.rs': 'rust', '.go': 'go',
            '.php': 'php', '.rb': 'ruby', '.c': 'c', '.cpp': 'cpp', '.h': 'c',
            '.hpp': 'cpp', '.cs': 'csharp', '.toml': 'toml', '.ini': 'ini',
            '.cfg': 'ini', '.conf': 'ini', '.env': 'plaintext',
            '.gitignore': 'plaintext', '.glsl': 'glsl', '.vert': 'glsl',
            '.frag': 'glsl', '.vue': 'vue', '.svelte': 'svelte', '.svg': 'xml',
        }
        
        ext = file_path.suffix.lower()
        if ext in extension_map:
            return extension_map[ext]
        
        filename = file_path.name.lower()
        if filename == 'dockerfile':
            return 'dockerfile'
        elif filename == 'makefile':
            return 'makefile'
        
        return 'plaintext'
    
    def _find_duplicates(self) -> Dict[str, List[str]]:
        hash_map = defaultdict(list)
        for filepath, file_hash in self.file_hashes.items():
            hash_map[file_hash].append(filepath)
        return {h: files for h, files in hash_map.items() if len(files) > 1}
    
    def _collect_files(self) -> List[Path]:
        files_to_export = []
        for root, dirs, files in os.walk(self.project_root):
            dirs[:] = [d for d in dirs if d not in self.EXCLUDE_DIRS]
            if not self.include_all:
                dirs[:] = [
                    d for d in dirs
                    if not d.startswith('.') or d in self.include_patterns
                ]
            
            root_path = Path(root)
            for file in files:
                file_path = root_path / file
                if self.should_include_file(file_path):
                    files_to_export.append(file_path)
        
        files_to_export.sort()
        return files_to_export
    
    def export(self, include_structure_only: bool = False, 
               include_stats: bool = True) -> bool:
        print(f"📂 Scanning project: {self.project_root}")
        print(f"📏 Max file size: {self.max_file_size:,} bytes")
        print(f"📝 Max lines per file: {self.max_lines_per_file}")
        if self.include_all:
            print("📁 Including: ALL directories (include-all mode)")
        else:
            print(f"📁 Including directories: {', '.join(self.include_patterns)} (+ root files)")
        if self.exclude_patterns:
            print(f"🚫 Excluding patterns: {', '.join(self.exclude_patterns)}")
        
        try:
            with open(self.output_file, 'w', encoding='utf-8') as outfile:
                outfile.write("=" * 80 + "\n")
                outfile.write("ADVANCED PROJECT CODE EXPORT\n")
                outfile.write(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
                outfile.write(f"Project: {self.project_root.name}\n")
                outfile.write(f"Path: {self.project_root}\n")
                outfile.write("=" * 80 + "\n\n")
                
                outfile.write("TABLE OF CONTENTS\n")
                outfile.write("=" * 80 + "\n")
                outfile.write("1. Project Structure\n")
                outfile.write("2. File Contents\n")
                if include_stats:
                    outfile.write("3. Statistics & Analysis\n")
                outfile.write("\n")
                
                outfile.write("1. PROJECT STRUCTURE\n")
                outfile.write("=" * 80 + "\n\n")
                outfile.write(f"{self.project_root.name}/\n")
                
                tree_lines = self.generate_tree()
                for line in tree_lines:
                    outfile.write(line + "\n")
                
                outfile.write("\n" + "=" * 80 + "\n\n")
                
                if include_structure_only:
                    print(f"✅ Structure exported to: {self.output_file}")
                    return True
                
                outfile.write("2. FILE CONTENTS\n")
                outfile.write("=" * 80 + "\n\n")
                
                outfile.write("EXPORT CONFIGURATION\n")
                outfile.write("-" * 40 + "\n")
                outfile.write(f"Max file size: {self.max_file_size:,} bytes\n")
                outfile.write(f"Max lines per file: {self.max_lines_per_file}\n")
                if self.include_all:
                    outfile.write("Included directories: ALL\n")
                else:
                    outfile.write(f"Included directories: {', '.join(self.include_patterns)} (+ root files)\n")
                if self.truncate_large_files:
                    outfile.write("Truncation: Enabled\n")
                else:
                    outfile.write("Truncation: Disabled\n")
                outfile.write("\n" + "=" * 80 + "\n\n")
                
                files_to_export = self._collect_files()
                total_files = len(files_to_export)
                
                if total_files == 0:
                    print("⚠️  No files matched the filters.")
                
                for i, file_path in enumerate(files_to_export, 1):
                    try:
                        relative_path = file_path.relative_to(self.project_root)
                    except ValueError:
                        relative_path = file_path
                    
                    content = self.read_file_content(file_path)
                    if content is None:
                        continue
                    
                    language = self.get_file_language(file_path)
                    file_size = len(content)
                    loc_stats = self._count_lines_of_code(content, language)
                    
                    self.file_count += 1
                    self.total_size += file_size
                    self.stats[language] += 1
                    
                    progress = (i / total_files) * 100
                    print(f"\r  Exporting: {progress:.0f}% [{i}/{total_files}]", end='', flush=True)
                    
                    outfile.write(f"\n{'─' * 80}\n")
                    outfile.write(f"FILE {i}/{total_files}: {relative_path}\n")
                    outfile.write(f"Language: {language} | Size: {file_size:,} bytes\n")
                    outfile.write(f"Lines: {loc_stats['total']} total | ")
                    outfile.write(f"{loc_stats['code']} code | ")
                    outfile.write(f"{loc_stats['comment']} comments | ")
                    outfile.write(f"{loc_stats['blank']} blank\n")
                    
                    if str(file_path) in self.truncated_files:
                        outfile.write("⚠️  NOTE: This file was truncated due to size limits\n")
                    
                    outfile.write(f"{'─' * 80}\n\n")
                    
                    outfile.write(f"```{language}\n")
                    outfile.write(content)
                    if not content.endswith('\n'):
                        outfile.write('\n')
                    outfile.write("```\n\n")
                
                print()
                
                if include_stats:
                    outfile.write("\n3. STATISTICS & ANALYSIS\n")
                    outfile.write("=" * 80 + "\n\n")
                    
                    outfile.write("GENERAL STATISTICS\n")
                    outfile.write("-" * 40 + "\n")
                    outfile.write(f"Total files exported: {self.file_count}\n")
                    outfile.write(f"Total size: {self.total_size:,} bytes ")
                    outfile.write(f"({self.total_size / 1024:.2f} KB, ")
                    outfile.write(f"{self.total_size / 1024 / 1024:.2f} MB)\n")
                    outfile.write(f"Average file size: {self.total_size / max(1, self.file_count):,.0f} bytes\n\n")
                    
                    if self.skipped_files:
                        outfile.write("SKIPPED FILES\n")
                        outfile.write("-" * 40 + "\n")
                        outfile.write(f"Total skipped: {len(self.skipped_files)}\n")
                        for skipped in self.skipped_files[:10]:
                            outfile.write(f"  • {skipped}\n")
                        if len(self.skipped_files) > 10:
                            outfile.write(f"  ... and {len(self.skipped_files) - 10} more\n")
                        outfile.write("\n")
                    
                    if self.truncated_files:
                        outfile.write("TRUNCATED FILES\n")
                        outfile.write("-" * 40 + "\n")
                        unique_truncated = sorted(set(self.truncated_files))
                        outfile.write(f"Total truncated: {len(unique_truncated)}\n")
                        for truncated in unique_truncated[:10]:
                            outfile.write(f"  • {truncated}\n")
                        if len(unique_truncated) > 10:
                            outfile.write(f"  ... and {len(unique_truncated) - 10} more\n")
                        outfile.write("\n")
                    
                    outfile.write("LANGUAGE DISTRIBUTION\n")
                    outfile.write("-" * 40 + "\n")
                    for lang, count in sorted(self.stats.items(), key=lambda x: x[1], reverse=True):
                        percentage = (count / max(1, self.file_count)) * 100
                        bar = '█' * int(percentage / 2)
                        outfile.write(f"{lang:15} {count:4} files ({percentage:5.1f}%) {bar}\n")
                    
                    duplicates = self._find_duplicates()
                    if duplicates:
                        outfile.write("\nDUPLICATE FILES DETECTED\n")
                        outfile.write("-" * 40 + "\n")
                        for hash_val, files in list(duplicates.items())[:5]:
                            outfile.write(f"\nHash: {hash_val}\n")
                            for file in files:
                                outfile.write(f"  • {file}\n")
                        if len(duplicates) > 5:
                            outfile.write(f"\n... and {len(duplicates) - 5} more duplicate groups\n")
                        outfile.write(f"\nTotal duplicate groups: {len(duplicates)}\n")
                    
                    outfile.write("\nEXPORT METADATA\n")
                    outfile.write("-" * 40 + "\n")
                    outfile.write(f"Export tool: Advanced Project Code Exporter v2.3\n")
                    outfile.write(f"Export date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
                    outfile.write(f"Python version: {sys.version}\n")
                    outfile.write(f"Platform: {sys.platform}\n")
                
                outfile.write("\n" + "=" * 80 + "\n")
                outfile.write("END OF EXPORT\n")
                outfile.write("=" * 80 + "\n")
            
            print(f"\n✅ Successfully exported {self.file_count} files to: {self.output_file}")
            print(f"📊 Total size: {self.total_size:,} bytes ({self.total_size / 1024:.2f} KB)")
            
            if self.skipped_files:
                print(f"⚠️  Skipped {len(self.skipped_files)} files (too large)")
            if self.truncated_files:
                print(f"⚠️  Truncated {len(set(self.truncated_files))} files (size limit)")
            
            print("\n📈 Language Distribution:")
            for lang, count in sorted(self.stats.items(), key=lambda x: x[1], reverse=True)[:5]:
                print(f"  • {lang}: {count} files")
            
            return True
            
        except Exception as e:
            print(f"\n❌ Error during export: {str(e)}")
            import traceback
            traceback.print_exc()
            return False


def main():
    parser = argparse.ArgumentParser(
        description='Advanced Project Code Exporter with size control',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Default: src + .storybook + root files (package.json, index.html, ...)
  python exporter.py -p ./my-project

  # Include EVERYTHING
  python exporter.py -p ./my-project --include-all

  # Truncate large files instead of skipping
  python exporter.py -p ./my-project --truncate --max-lines 500
        """
    )
    
    parser.add_argument('-p', '--project', default='.', help='Project root directory')
    parser.add_argument('-o', '--output', default=None, help='Output filename')
    parser.add_argument('--structure-only', action='store_true', help='Only export tree structure')
    parser.add_argument('--no-stats', action='store_true', help='Do not include statistics')
    parser.add_argument('--max-size', type=int, default=500 * 1024, help='Maximum file size in bytes (default: 500KB)')
    parser.add_argument('--max-lines', type=int, default=1000, help='Maximum lines per file (default: 1000)')
    parser.add_argument('--include', default='src,.storybook', help='Comma-separated directories to include (default: src,.storybook). Root files are always included.')
    parser.add_argument('--include-all', action='store_true', help='Include ALL directories (disables --include filtering)')
    parser.add_argument('--exclude', default='', help='Comma-separated patterns to exclude')
    parser.add_argument('--truncate', action='store_true', help='Truncate large files instead of skipping them')
    parser.add_argument('--max-depth', type=int, default=10, help='Maximum tree depth')
    
    args = parser.parse_args()
    
    include_patterns = [p.strip() for p in args.include.split(',') if p.strip()]
    exclude_patterns = [p.strip() for p in args.exclude.split(',') if p.strip()]
    
    exporter = AdvancedProjectExporter(
        project_root=args.project,
        output_file=args.output,
        max_file_size=args.max_size,
        max_lines_per_file=args.max_lines,
        include_patterns=include_patterns,
        exclude_patterns=exclude_patterns,
        truncate_large_files=args.truncate,
        include_all=args.include_all,
    )
    
    success = exporter.export(
        include_structure_only=args.structure_only,
        include_stats=not args.no_stats
    )
    
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()