using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Moq;
using System;
using System.Collections.Generic;
using System.Text;
using Xunit;
using Xunit.Abstractions;
using ZRepo;
using ZRepo.Core;

namespace ZRepoTest.Core
{
    public class GitCoreTest
    {

        private readonly ITestOutputHelper output;

        public GitCoreTest(ITestOutputHelper output)
        {
            this.output = output;
        }


        [Fact]
        public void RepoExists()
        {
            var repoSettings = new RepoSettings
            {
                Root = "./resources/Repos"
            };
            var settings = new Mock<IOptions<RepoSettings>>();
            settings.Setup(s => s.Value).Returns(repoSettings);
            var gitCore = new GitCore(settings.Object);
            this.output.WriteLine(gitCore.RepoExists("Lorem"));
        }

    }
}
