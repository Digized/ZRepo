using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using LibGit2Sharp;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace ZRepo.Core
{

    public class GitCore
    {

        private readonly RepoSettings repoSettings;
        private readonly ILogger<GitCore> logger;

        public GitCore(IOptions<RepoSettings> settings, ILogger<GitCore> logger)
        {
            this.logger = logger;
            repoSettings = settings.Value;

            Directory.CreateDirectory(repoSettings.Root);

        }

        public IEnumerable<string> GetRepos()
        {
            return Directory.GetDirectories(this.repoSettings.Root).Select(item => Path.GetRelativePath(repoSettings.Root, item));
        }


        private static void ValidateRepo(string path)
        {
            if (!Directory.Exists(Path.Combine(path, ".git")))
            {
                throw new DirectoryNotFoundException();
            }
        }

        public RepoFile GetFile(string repoName, string path)
        {
            var basePath = Path.Combine(repoSettings.Root, repoName);
            ValidateRepo(basePath);
            var file = new RepoFile();
            if (path == null)
            {
                path = "README.md";
            }
            var fullPath = Path.Combine(basePath, path);
            if (Directory.Exists(fullPath))
            {
                return null;
            }

            if (File.Exists(fullPath))
            {
                var fileInfo = new FileInfo(fullPath);
                file.FileContent = File.ReadAllText(fullPath);
                file.FileExtension = fileInfo.Extension;
                file.FileName = fileInfo.FullName;
            }

            return file;
        }

        public IEnumerable<FileTree> GenerateTree(string repoName, string path)
        {
            var repoPath = Path.Combine(repoSettings.Root, repoName);
            ValidateRepo(repoPath);
            IEnumerable<FileTree> root;
            using (var repo = new Repository(repoPath))
            {
                var tree = repo.Lookup("master").Peel<Tree>();
                string basePath = repoName;
                if (path != null)
                {
                    if (!Directory.Exists(Path.Combine(repoPath, path)))
                    {
                        return null;
                    }
                    tree = goToPath(tree, path);
                    basePath = Path.Join(basePath, path);
                }
                root = Task.WhenAll(tree.Select(async item => await _generateTree(item, basePath))).Result;
            }
            return root;

        }

        private Tree goToPath(Tree tree, string path)
        {

            TreeEntry treeItem;
            foreach (var folder in path.Split("/"))
            {
                treeItem = tree.First(item => item.Path == folder);
                if (treeItem.TargetType != TreeEntryTargetType.Tree)
                {
                    throw new ArgumentException();
                }
                tree = treeItem.Target.Peel<Tree>();
            }
            return tree;
        }

        private async Task<FileTree> _generateTree(TreeEntry tree, string parent = null)
        {
            var file = new FileTree();
            var RelativePath = tree.Path;
            if (parent != null)
            {
                RelativePath = Path.Combine(parent, RelativePath);
            }
            var path = Path.Combine(repoSettings.Root, RelativePath);
            var fi = new FileInfo(path);
            logger.LogInformation(file.RelativePath);
            logger.LogInformation(Path.DirectorySeparatorChar + "");
            file.RelativePath = string.Join("/", RelativePath.Split(Path.DirectorySeparatorChar));
            if (tree.TargetType == TreeEntryTargetType.Tree)
            {
                var treeItems = tree.Target.Peel<Tree>();
                var subItems = await Task.WhenAll(treeItems.Select(async item => await _generateTree(item, RelativePath)));
                file.byteSize = subItems.Sum(item => item.byteSize);
                file.subItems = subItems;
                file.type = FileType.Folder;
            }
            else
            {
                file.type = FileType.File;
                file.Extension = fi.Extension;
                file.byteSize = fi.Length;
            }
            file.Name = fi.Name;
            return file;
        }


    }


    public enum FileType
    {
        File,
        Folder
    }


    public class FileTree
    {
        public string Extension { get; set; }
        public string Name { get; set; }
        public string RelativePath { get; set; }
        public long byteSize { get; set; }
        public string Size
        {
            get
            {
                return Util.FormatBytes(this.byteSize);
            }
        }
        public FileType type { get; set; }
        public IEnumerable<FileTree> subItems { get; set; }

    }

    public class RepoFile
    {
        public string FileContent { get; set; }
        public string FileName { get; set; }
        public string FileExtension { get; set; }
    }

}