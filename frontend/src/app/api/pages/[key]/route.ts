import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const getDataPath = () => {
  const cwd = process.cwd();
  if (cwd.endsWith("frontend")) {
    return path.join(cwd, "src/data/pages.json");
  }
  return path.join(cwd, "frontend/src/data/pages.json");
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const resolvedParams = await params;
    const { key } = resolvedParams;
    const dataPath = getDataPath();
    const fileData = await fs.readFile(dataPath, "utf8");
    const pages = JSON.parse(fileData);

    const page = pages.find((p: any) => p.key === key);
    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    return NextResponse.json(page);
  } catch (error) {
    console.error(`API GET page [${(await params).key}] error:`, error);
    return NextResponse.json({ error: "Failed to read page" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const resolvedParams = await params;
    const { key } = resolvedParams;
    const dataPath = getDataPath();
    const fileData = await fs.readFile(dataPath, "utf8");
    const pages = JSON.parse(fileData);

    const index = pages.findIndex((p: any) => p.key === key);
    if (index === -1) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    const body = await request.json();
    
    // Merge or update the fields
    const updatedPage = {
      ...pages[index],
      title: body.title !== undefined ? body.title : pages[index].title,
      status: body.status !== undefined ? body.status : pages[index].status,
      metadata: body.metadata !== undefined ? body.metadata : pages[index].metadata,
      content: body.content !== undefined ? body.content : pages[index].content,
    };

    pages[index] = updatedPage;
    await fs.writeFile(dataPath, JSON.stringify(pages, null, 2), "utf8");

    return NextResponse.json(updatedPage);
  } catch (error) {
    console.error(`API PUT page [${(await params).key}] error:`, error);
    return NextResponse.json({ error: "Failed to update page" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const resolvedParams = await params;
    const { key } = resolvedParams;
    
    // Prevent deletion of system pages
    if (key === "home" || key === "product") {
      return NextResponse.json({ error: "Cannot delete system pages" }, { status: 400 });
    }

    const dataPath = getDataPath();
    const fileData = await fs.readFile(dataPath, "utf8");
    const pages = JSON.parse(fileData);

    const index = pages.findIndex((p: any) => p.key === key);
    if (index === -1) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    const deletedPage = pages.splice(index, 1)[0];
    await fs.writeFile(dataPath, JSON.stringify(pages, null, 2), "utf8");

    return NextResponse.json({ message: "Page deleted successfully", page: deletedPage });
  } catch (error) {
    console.error(`API DELETE page [${(await params).key}] error:`, error);
    return NextResponse.json({ error: "Failed to delete page" }, { status: 500 });
  }
}
