import { test, expect } from '@playwright/test';

const uniqueName = `playwright-${Date.now()}`;

test.describe('Registration API regression suite', () => {
  test('creates, reads, and deletes a user through the API', async ({ request }) => {
    const submitResponse = await request.post('/submit', {
      form: {
        firstname: uniqueName,
        lastname: 'Api',
        country: 'Canada',
        gender: 'Male',
      },
    });

    expect(submitResponse.ok()).toBeTruthy();
    const submitBody = await submitResponse.text();
    expect(submitBody).toContain('Submission Successful');
    expect(submitBody).toContain(uniqueName);

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
