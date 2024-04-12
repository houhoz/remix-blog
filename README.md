# Welcome to Remix + Vite!

📖 See the [Remix docs](https://remix.run/docs) and the [Remix Vite docs](https://remix.run/docs/en/main/future/vite) for details on supported features.

## Development

Run the Vite dev server:

```shellscript
npm run dev
```

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying Node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `npm run build`

- `build/server`
- `build/client`


```bash
# 安装 Tailwind CSS
pnpm add tailwindcss postcss autoprefixer
# 初始化 tailwindcss
pnpm exec tailwindcss init --ts -p

# 安装nextui
pnpm add @nextui-org/react framer-motion

# prisma
pnpm i prisma  -D
pnpm i @prisma/client

# 初始化
pnpm exec prisma init --datasource-provider sqlite

pnpm exec prisma migrate dev --name init
pnpm exec prisma db push

pnpm i @tailwindcss/typography

```


```jsx
export const action = async (c: ActionFunctionArgs) => {
  const postId = c.params.postId as string;
  const formData = await c.request.formData()

  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const slug = formData.get('slug') as string

  const action = formData.get('action') as 'edit' | 'delete'

  if (action === 'delete') {
    await prisma.post.delete({
      where: {
        id: postId
      }
    })

    return redirect("/")
  } else {
    await prisma.post.update({
      where: {
        id: postId
      },
      data: {
        id: slug,
        title,
        content
      }
    })

    return redirect(`/posts/${slug}`)
  }
}

 const isDeleting = navigation.state === 'submitting' && navigation.formData?.get("action") === 'delete'
const isEditing = navigation.state === 'submitting' && navigation.formData?.get("action") === 'edit'


<Button name="action" value="edit" isLoading={isEditing} type="submit" color="primary">更新</Button>
<Button name="action" value="delete" isLoading={isDeleting} type="submit" color="danger">删除</Button>

// const submit = useSubmit()

// <Button name="action" value="delete" isLoading={isDeleting} onClick={_ => {
//   if (confirm("确定删除吗？")) {
//     const formData = new FormData()
//     formData.set("action", "delete")
//     submit(formData, {
//       method: "POST",
//       action: `/posts/${loaderData.post.id}/delete`
//     })
//   }
// }} color="danger">删除</Button>

```