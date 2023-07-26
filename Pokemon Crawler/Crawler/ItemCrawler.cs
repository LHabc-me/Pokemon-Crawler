namespace Pokemon_Crawler.Crawler;

public class ItemCrawler : Crawler
{
    public override async Task<Dictionary<string, string>> CrawlAsync()
    {
        var mainPage = await GetPageAsync("https://wiki.52poke.com/wiki/道具列表");

        // 选择所有tr标签，有五个td子标签
        var urls = from item in mainPage.QuerySelectorAll("tr")
            where item.Children.Length == 5 &&
                  item.Children.All(x => x.TagName == "TD") &&
                  item.Children[1].QuerySelector("a") != null
            select new Tuple<string, string>
            (item.Children[1].QuerySelector("a")!.TextContent,
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
                if (srcUrl == CrawlerConfig.BaseUrl) {
                    Console.WriteLine($"failed to get {id}");
                    continue;
                }
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
        // 去重
        result = result.GroupBy(x => x.id).Select(x => x.First()).ToArray();
        return result.ToDictionary(x => x.id, x => x.wikiText);
    }
}
