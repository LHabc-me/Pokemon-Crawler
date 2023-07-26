using System.Text.RegularExpressions;

namespace Pokemon_Crawler.Crawler;

public class PokemonCrawler : Crawler
{
    public override async Task<Dictionary<string, string>> CrawlAsync()
    {
        var mainPage = await GetPageAsync(CrawlerConfig.BaseUrl + "wiki/宝可梦列表（按全国图鉴编号）/简单版");

        // 查找有4个子标签
        // 且子标签都是td标签
        // 且首个子标签为#xxxx(x为数字)的格式
        // 且另外三个子标签包含a标签
        // 的tr标签
        var urls = from item in mainPage.QuerySelectorAll("tr")
            where item.Children.Length == 4
                  && item.Children.All(x => x.TagName == "TD")
                  && Regex.IsMatch(item.Children[0].TextContent, @"#\d{4}")
                  && item.Children[1].QuerySelector("a") != null
                  && item.Children[2].QuerySelector("a") != null
                  && item.Children[3].QuerySelector("a") != null
            select new Tuple<string, string>
            (item.Children[0].TextContent,
                CrawlerConfig.BaseUrl + item.Children[1].QuerySelector("a")!.GetAttribute("href"));

        var total = urls.Count();
        var finished = 0;
        var lockObj = new object();
        var tasks = urls.Select(async item =>
        {
            var (id, url) = item;
            string? wikiText = null; // 爬取失败时为null，需要重试
            while (wikiText == null) {
                var page = await GetPageAsync(url);

                // 找到"查看源代码"按钮跳转的页面
                string srcUrl = CrawlerConfig.BaseUrl +
                                page.QuerySelector("#ca-viewsource > a")?.GetAttribute("href");

                var srcPage = await GetPageAsync(srcUrl);
                // 找到"源代码"
                wikiText = srcPage.QuerySelector("#wpTextbox1")?.TextContent;
            }
            lock (lockObj) {
                Console.WriteLine($"[{++finished}/{total}] {id.Trim()}");
            }
            return (id, wikiText);
        });

        var result = await Task.WhenAll(tasks);
        return result.ToDictionary(x => x.id, x => x.wikiText);
    }
}
