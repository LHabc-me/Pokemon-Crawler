using System.Text.RegularExpressions;

namespace Pokemon_Crawler.Crawler;

public class MoveCrawler : Crawler
{
    public override async Task<Dictionary<string, string>> CrawlAsync()
    {
        var mainPage = await GetPageAsync(CrawlerConfig.BaseUrl + "wiki/招式列表");

        // 选择所有tr标签，有十个td子标签
        var urls = from item in mainPage.QuerySelectorAll("tr")
            where item.Children.Length == 10
                  && item.Children.All(x => x.TagName == "TD")
                  && item.Children[1].QuerySelectorAll("a") != null
            select new Tuple<string, string>
            (item.Children[0].TextContent.Trim() + item.Children[1].QuerySelectorAll("a").Last().TextContent.Trim(),
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
                Console.WriteLine($"[{++finished}/{total}] {id}");
            }
            return (id, wikiText);
        });

        var result = await Task.WhenAll(tasks);
        return result.ToDictionary(x => x.id, x => x.wikiText);
    }
}
