using Pokemon_Crawler.Crawler;

public class Program
{
    public static async Task Main()
    {
        string[] crawlerNames = {
            // "Pokemon", 
            // "Item",
            "Move",
        };
        foreach (var crawlerName in crawlerNames) {
            var type = Type.GetType($"Pokemon_Crawler.Crawler.{crawlerName}Crawler");
            var crawler = (Crawler)Activator.CreateInstance(type!)!;
            // crawler.Interval = TimeSpan.Zero;
            crawler.Interval = TimeSpan.FromMilliseconds(1);
            var result = await crawler.CrawlAsync();
            Directory.CreateDirectory($"data/{crawlerName}");
            await Task.WhenAll(result.Select(async item =>
            {
                await File.WriteAllTextAsync($"data/{crawlerName}/{item.Key}", item.Value);
            }));
        }

    }
}
