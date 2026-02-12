import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CodeMates - Developer Networking",
    short_name: "CodeMates",
    description: "A social platform for developers to chat and collaborate.",
    start_url: "/login",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#00ff9e",
    icons: [
      {
        src: "/public/codemates.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
         src: "/public/codemates.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
