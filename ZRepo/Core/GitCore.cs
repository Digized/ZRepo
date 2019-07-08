using System.IO;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;

namespace ZRepo.Core
{

    public class GitCore
    {

        private readonly RepoSettings repoSettings;

        public GitCore(IOptions<RepoSettings> settings)
        {
            repoSettings = settings.Value;
        }


        public string RepoExists(string repoName)
        {
            var path = Path.Combine(repoSettings.Root, repoName);
            return Path.GetDirectoryName(path);
        }
    }

}