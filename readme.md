## Setup

These instructions are for macOS.

*   Install [VSCodium].

*   Switch extension registry from Open VSX to Microsoft's VS Code. ¹

    *   Replace content of `~/Library/Application Support/VSCodium/product.json`
        with the following:

        ```json
        {
            "extensionsGallery": {
                "serviceUrl": "https://marketplace.visualstudio.com/_apis/public/gallery",
                "itemUrl": "https://marketplace.visualstudio.com/items",
                "cacheUrl": "https://vscode.blob.core.windows.net/gallery/index",
                "controlUrl": ""
            }
        }
        ```

*   Install required extensions.
    *   C# support: [C#], [C# Dev Kit].
    *   C++ support: [C/C++ Extension Pack].
*   Install [Homebrew].
*   `brew install gcc`.

## Reference

¹ VSCodium contributors, Nov 2023, _How to use a different extension gallery_,
https://github.com/VSCodium/vscodium/blob/f3a6b95/docs/index.md#how-to-use-a-different-extension-gallery

[VSCodium]: https://vscodium.com/
[C#]: https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.csharp
[C# Dev Kit]: https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.csdevkit
[C/C++ Extension Pack]: https://marketplace.visualstudio.com/items?itemName=ms-vscode.cpptools-extension-pack
[Homebrew]: https://brew.sh/
