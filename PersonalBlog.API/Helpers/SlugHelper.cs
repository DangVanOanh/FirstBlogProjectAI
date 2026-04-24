using System.Text;
using System.Text.RegularExpressions;

namespace PersonalBlog.API.Helpers;

public static class SlugHelper
{
    public static string Generate(string input)
    {
        var slug = input.ToLowerInvariant().Normalize(NormalizationForm.FormD);
        slug = Regex.Replace(slug, @"[^a-z0-9\s-]", "");
        slug = Regex.Replace(slug, @"\s+", "-");
        return slug.Trim('-');
    }
}
