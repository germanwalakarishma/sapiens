import { configureStore } from '@reduxjs/toolkit';
import reducer, { fetchUsers, createUser } from '../../store/userSlice';
import axios from 'axios';
import { User } from '../../types';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('userSlice', () => {
  const makeStore = () =>
    configureStore({ reducer: { users: reducer } });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('dispatches fetchUsers → fulfilled and populates state.users', async () => {
    const sampleUsers: User[] = [{ _id: '1', firstName: 'John', lastName: 'Doe', email: 'john@test.com', createdAt: '2024-01-01' }];
    mockedAxios.get.mockResolvedValueOnce({ data: sampleUsers });

    const store = makeStore();
    await store.dispatch(fetchUsers());

    const state = store.getState().users;
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.users).toEqual(sampleUsers);
    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.stringMatching(/\/api\/users$/)
    );
  });

  it('sets loading=true while fetchUsers is pending', async () => {
    let resolveGet!: (v: unknown) => void;
    mockedAxios.get.mockImplementation(
      () => new Promise((res) => (resolveGet = res))
    );

    const store = makeStore();
    const fetchPromise = store.dispatch(fetchUsers());
    expect(store.getState().users.loading).toBe(true);

    resolveGet({ data: [] });
    await fetchPromise;
  });

  it('handles fetchUsers → rejected and stores error message', async () => {
    mockedAxios.get.mockRejectedValueOnce(
      new Error('Network down')
    );

    const store = makeStore();
    await store.dispatch(fetchUsers());

    const state = store.getState().users;
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Network down');
  });

  it('handles fetchUsers → rejected and stores as default error message', async () => {
    mockedAxios.get.mockRejectedValueOnce(
      new Error('')
    );

    const store = makeStore();
    await store.dispatch(fetchUsers());

    const state = store.getState().users;
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Failed to fetch users');
  });

  it('dispatches createUser → fulfilled and appends new user', async () => {
    const newUser: User = { _id: '2', firstName: 'John1', lastName: 'Doe1', email: 'john1@test.com', createdAt: '2024-01-02' };
    mockedAxios.post.mockResolvedValueOnce({ data: newUser });

    const store = makeStore();
    await store.dispatch(createUser(newUser));

    const state = store.getState().users;
    expect(state.users).toContainEqual(newUser);
    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.stringMatching(/\/api\/users$/),
      newUser
    );
  });

  it('handles createUser → rejected and stores as default error message', async () => {
    const newUser: User = { _id: '2', firstName: 'John1', lastName: 'Doe1', email: 'john1@test.com', createdAt: '2024-01-02' };
    mockedAxios.post.mockRejectedValueOnce(
      new Error('')
    );

    const store = makeStore();
    await store.dispatch(createUser(newUser));

    const state = store.getState().users;
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Failed to create user');
  });
});
