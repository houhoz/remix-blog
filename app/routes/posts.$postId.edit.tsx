import {
  LoaderFunctionArgs,
  json,
  redirect,
  ActionFunctionArgs,
} from '@remix-run/node';
import {
  Form,
  useLoaderData,
  useNavigation,
  useFetcher,
} from '@remix-run/react';
import { Input, Textarea, Button } from '@nextui-org/react';
import { prisma } from '~/prisma.server';
import { auth } from '~/session.server';

export const action = async (c: ActionFunctionArgs) => {
  const postId = c.params.postId as string;
  const formData = await c.request.formData();

  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const slug = formData.get('slug') as string;

  await prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      id: slug,
      title,
      content,
    },
  });

  return redirect(`/posts/${slug}`);
};

export const loader = async (c: LoaderFunctionArgs) => {
  const user = await auth(c.request);
  if (!user.username) {
    return redirect('/signin');
  }
  const postId = c.params.postId as string;
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });

  if (!post) {
    throw new Response('找不到文章', {
      status: 404,
    });
  }

  return json({
    post,
  });
};

export default function Page() {
  const loaderData = useLoaderData<typeof loader>();

  const navigation = useNavigation();

  const deleteFetcher = useFetcher();

  const isDeleting = deleteFetcher.state === 'submitting';

  const isEditing =
    navigation.state === 'submitting' &&
    navigation.formData?.get('action') === 'edit';

  return (
    <div className="p-12">
      <Form method="POST">
        <div className="flex flex-col gap-3">
          <Input
            label="slug"
            name="slug"
            defaultValue={loaderData.post.id}
          />
          <Input
            label="标题"
            name="title"
            defaultValue={loaderData.post.title}
          />
          <Textarea
            minRows={10}
            label="正文"
            name="content"
            defaultValue={loaderData.post.content}
          />
          <Button
            name="action"
            value="edit"
            isLoading={isEditing}
            type="submit"
            color="primary"
          >
            更新
          </Button>
        </div>
      </Form>
      <Button
        name="action"
        value="delete"
        isLoading={isDeleting}
        onClick={(_) => {
          if (confirm('确定删除吗？')) {
            deleteFetcher.submit(null, {
              method: 'POST',
              action: `/posts/${loaderData.post.id}/delete`,
            });
          }
        }}
        color="danger"
      >
        删除
      </Button>
    </div>
  );
}
