import { test, expect } from '@playwright/test';

const buildUserPayload = (uniqueName: string) => ({
  firstname: uniqueName,
  lastname: 'Api',
  country: 'Canada',
  gender: 'Male',
});

const createUser = async (request: any, uniqueName: string) => {
  const submitResponse = await request.post('/submit', {
    form: buildUserPayload(uniqueName),
  });

  expect(submitResponse.ok()).toBeTruthy();
  const submitBody = await submitResponse.text();
  expect(submitBody).toContain('Submission Successful');
  expect(submitBody).toContain(uniqueName);

  return submitBody;
};

test.describe('Registration API regression suite', () => {
  test('creates a user through the API', async ({ request }) => {
    const uniqueName = `create-${Date.now()}`;
    await createUser(request, uniqueName);
  });

  test('reads a created user from the users list through the API', async ({ request }) => {
    const uniqueName = `read-${Date.now()}`;
    await createUser(request, uniqueName);

    const usersResponse = await request.get('/users');
    expect(usersResponse.ok()).toBeTruthy();
    const usersBody = await usersResponse.text();
    expect(usersBody).toContain(uniqueName);
  });

  test('deletes a user through the API', async ({ request }) => {
    const uniqueName = `delete-${Date.now()}`;
    await createUser(request, uniqueName);

    const usersResponse = await request.get('/users');
    expect(usersResponse.ok()).toBeTruthy();
    const usersBody = await usersResponse.text();
    expect(usersBody).toContain(uniqueName);

    const userIdMatch = usersBody.match(new RegExp(`data-user-id="(\\d+)"[\\s\\S]*?data-firstname="${uniqueName}"`));
    expect(userIdMatch).toBeTruthy();
    const userId = userIdMatch![1];

    const deleteResponse = await request.delete(`/delete/${userId}`);
    expect(deleteResponse.ok()).toBeTruthy();
    const deleteBody = await deleteResponse.json();
    expect(deleteBody.message).toContain('deleted successfully');
  });
});
