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
        }

        public string[] GetRepos()
        {
            return Directory.GetDirectories(this.repoSettings.Root);
        }


        private static void ValidateRepo(string path)
        {
            if (!Directory.Exists(Path.Combine(path, ".git")))
            {
                throw new DirectoryNotFoundException();
            }
        }

        public string GetFile(string repoName, string path)
        {
            var basePath = Path.Combine(repoSettings.Root, repoName);
            ValidateRepo(basePath);
            var fullPath = Path.Combine(basePath, path);
            if (Directory.Exists(fullPath))
            {
                return "FOLDER";
            }

            if (File.Exists(fullPath))
            {
                return File.ReadAllText(fullPath);
            }

            return "";
        }

        public IEnumerable<FileTree> GenerateTree(string repoName)
        {
            var path = Path.Combine(repoSettings.Root, repoName);
            ValidateRepo(path);
            IEnumerable<FileTree> root;
            using (var repo = new Repository(path))
            {
                var tree = repo.Lookup("master").Peel<Tree>();
                root = Task.WhenAll(tree.Select(async item => await _generateTree(repoName, item))).Result;
            }


            return root;

        }

        private async Task<FileTree> _generateTree(string parent, TreeEntry tree)
        {
            var file = new FileTree();
            var RelativePath = Path.Combine(parent, tree.Path);
            var path = Path.Combine(repoSettings.Root, RelativePath);
            var fi = new FileInfo(path);
            file.RelativePath = tree.Path;

            if (tree.TargetType == TreeEntryTargetType.Tree)
            {
                var treeItems = tree.Target.Peel<Tree>();
                var subItems = await Task.WhenAll(treeItems.Select(async item => await _generateTree(RelativePath, item)));
                file.size = subItems.Sum(item => item.size);
                file.subItems = subItems;
                file.type = FileType.Folder;
            }
            else
            {
                file.type = FileType.File;
                file.Extension = fi.Extension;
                file.size = fi.Length;
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
        public long size { get; set; }
        public FileType type { get; set; }
        public IEnumerable<FileTree> subItems { get; set; }

    }

}