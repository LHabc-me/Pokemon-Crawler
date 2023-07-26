using AngleSharp;
using AngleSharp.Dom;

namespace Pokemon_Crawler.Crawler;

public class CrawlerConfig
{
    public static string BaseUrl { get; set; } = "https://wiki.52poke.com/";
}
public abstract class Crawler
{
    /**
     * Interval(ms) between each http request
     */
    public TimeSpan Interval { get; set; } = TimeSpan.FromSeconds(1);

    /**
     * Crawl data from the website
     * <returns>
     *     Dictionary: key is the id of the pokemon/move/item, value is the wiki text
     * </returns>
     */
    public abstract Task<Dictionary<string, string>> CrawlAsync();

    protected async Task<IDocument> GetPageAsync(string url)
    {
        IDocument doc;
        // Console.WriteLine("Downloading " + url);
        if (Interval == TimeSpan.Zero) {
            doc = await DownloadPageAsync(url);
        } else {
            doc = await DownloadPageWithIntervalAsync(url);
        }
        return doc;
    }

    private async Task<IDocument> DownloadPageAsync(string url)
    {
        var doc = await _browser.OpenAsync(url);
        return doc;
    }

    private async Task<IDocument> DownloadPageWithIntervalAsync(string url)
    {
        await _semaphore.WaitAsync();
        try {
            bool needDelay = _lastRequestTime + Interval > DateTime.Now;
            if (needDelay) {
                await Task.Delay(Interval);
            }
            var doc = await DownloadPageAsync(url);
            _lastRequestTime = DateTime.Now;
            return doc;
        } finally {
            _semaphore.Release();
        }
    }

    private readonly IBrowsingContext _browser = BrowsingContext.New(Configuration.Default.WithDefaultLoader());
    private DateTime _lastRequestTime = DateTime.MinValue;
    private readonly SemaphoreSlim _semaphore = new(1, 1);
}
