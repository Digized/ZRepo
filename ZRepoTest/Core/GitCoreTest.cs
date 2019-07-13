using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Moq;
using Microsoft.Extensions.Logging;
using Xunit;
using Xunit.Abstractions;
using ZRepo;
using ZRepo.Core;
using System.IO;
using System;

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
                Root = Path.Combine(AppContext.BaseDirectory, "resources", "Repos")
            };
            this.output.WriteLine(repoSettings.Root);
            var settings = new Mock<IOptions<RepoSettings>>();
            settings.Setup(s => s.Value).Returns(repoSettings);
            var logger = Mock.Of<ILogger<GitCore>>();
            var gitCore = new GitCore(settings.Object, logger);
            this.output.WriteLine(gitCore.GetFile("Lorem", "lorem.txt"),
            @"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Dui faucibus in ornare quam viverra orci sagittis eu. Velit laoreet id donec ultrices tincidunt arcu non sodales neque. Duis ultricies lacus sed turpis. Dolor sit amet consectetur adipiscing. Venenatis a condimentum vitae sapien. Ut venenatis tellus in metus vulputate eu. Sed felis eget velit aliquet sagittis. Non consectetur a erat nam. Maecenas sed enim ut sem viverra. Sed libero enim sed faucibus turpis in eu mi bibendum. Sed vulputate odio ut enim blandit volutpat maecenas. Tempor orci dapibus ultrices in. In hendrerit gravida rutrum quisque non tellus. Etiam tempor orci eu lobortis elementum nibh tellus molestie nunc. Arcu bibendum at varius vel pharetra. Auctor urna nunc id cursus metus aliquam. Nisl tincidunt eget nullam non nisi est sit. Fusce id velit ut tortor pretium viverra suspendisse.

Sit amet facilisis magna etiam tempor. Interdum velit laoreet id donec ultrices. Quam nulla porttitor massa id neque. Amet consectetur adipiscing elit ut aliquam purus sit. Odio eu feugiat pretium nibh. Senectus et netus et malesuada fames. Eleifend donec pretium vulputate sapien nec sagittis aliquam. Lectus arcu bibendum at varius vel pharetra. Enim sed faucibus turpis in eu mi bibendum neque. Pulvinar etiam non quam lacus suspendisse faucibus interdum posuere lorem. Enim nunc faucibus a pellentesque sit amet. Sit amet cursus sit amet dictum sit amet justo.

Quam id leo in vitae. Ullamcorper eget nulla facilisi etiam dignissim diam. Quis auctor elit sed vulputate mi. Mi proin sed libero enim sed faucibus turpis. Cras semper auctor neque vitae tempus quam. Pellentesque dignissim enim sit amet venenatis urna cursus eget. Feugiat scelerisque varius morbi enim nunc faucibus a. Senectus et netus et malesuada fames ac turpis egestas integer. Bibendum est ultricies integer quis auctor elit sed vulputate mi. Velit aliquet sagittis id consectetur purus ut faucibus pulvinar elementum. Netus et malesuada fames ac turpis egestas. Diam vulputate ut pharetra sit. Rhoncus mattis rhoncus urna neque viverra. Massa sed elementum tempus egestas sed sed risus pretium. Nulla aliquet porttitor lacus luctus accumsan tortor posuere. Duis ultricies lacus sed turpis tincidunt id. Lobortis scelerisque fermentum dui faucibus in ornare quam. Purus viverra accumsan in nisl.

Massa vitae tortor condimentum lacinia. Cras adipiscing enim eu turpis egestas pretium aenean pharetra magna. Est placerat in egestas erat imperdiet sed euismod. Semper auctor neque vitae tempus. Tortor posuere ac ut consequat semper viverra nam libero justo. Cras fermentum odio eu feugiat pretium nibh ipsum. Nulla pellentesque dignissim enim sit amet venenatis urna cursus eget. Enim ut tellus elementum sagittis vitae et. Et tortor consequat id porta nibh venenatis. Pellentesque diam volutpat commodo sed. Egestas sed sed risus pretium quam. At varius vel pharetra vel turpis. Montes nascetur ridiculus mus mauris vitae ultricies. Neque viverra justo nec ultrices dui sapien eget mi. Sit amet consectetur adipiscing elit. Lectus vestibulum mattis ullamcorper velit sed. Ut consequat semper viverra nam. Ac auctor augue mauris augue neque. Vel quam elementum pulvinar etiam non quam lacus suspendisse faucibus. Elit pellentesque habitant morbi tristique senectus et netus.

Nulla facilisi morbi tempus iaculis urna id. Curabitur gravida arcu ac tortor. Enim neque volutpat ac tincidunt vitae. Gravida rutrum quisque non tellus orci. Eu nisl nunc mi ipsum faucibus vitae aliquet nec ullamcorper. Viverra nam libero justo laoreet sit amet cursus sit amet. Eu tincidunt tortor aliquam nulla facilisi. Porta lorem mollis aliquam ut porttitor. Quis eleifend quam adipiscing vitae proin sagittis nisl rhoncus mattis. Vitae elementum curabitur vitae nunc sed velit dignissim sodales.");
        }

    }
}
