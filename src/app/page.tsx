'use client';

import { useState, useEffect } from 'react';
import { trpc } from '@/utils/trpc';

export default function Home() {
  const [name, setName] = useState('');
  const [id, setId] = useState(1);
  const [filter, setFilter] = useState('');
  const [helloResult, setHelloResult] = useState('');
  const [complexResult, setComplexResult] = useState<any>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [cursor, setCursor] = useState<number | undefined>();
  const [postInput, setPostInput] = useState({
    title: '',
    content: '',
    tags: [] as string[],
    isDraft: false
  });
  const [currentTag, setCurrentTag] = useState('');

  const handleHelloWorld = async () => {
    const result = await trpc.hello.query({ name });
    setHelloResult(result.greeting);
  };

  const handleComplexData = async () => {
    const result = await trpc.complexData.query({ id, filter });
    setComplexResult(result);
  };

  const handleLoadProfile = async () => {
    try {
      const result = await trpc.profile.query();
      setProfileData(result);
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  };

  const handleCreatePost = async () => {
    try {
      const result = await trpc.createPost.mutate({
        ...postInput,
        tags: [...postInput.tags]
      });
      alert('Post created successfully!');
      setPostInput({
        title: '',
        content: '',
        tags: [],
        isDraft: false
      });
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  const handleLoadPosts = async () => {
    try {
      const result = await trpc.posts.list.query({
        limit: 5,
        cursor
      });
      setPosts(prev => [...prev, ...result.items]);
      setCursor(result.nextCursor);
    } catch (error) {
      console.error('Failed to load posts:', error);
    }
  };

  const handleAddTag = () => {
    if (currentTag && postInput.tags.length < 5) {
      setPostInput(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag]
      }));
      setCurrentTag('');
    }
  };


  return (
    <main className="min-h-screen p-24">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Hello World Demo</h2>
          <div className="space-y-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full p-2 border rounded"
            />
            <button
              onClick={handleHelloWorld}
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Say Hello
            </button>
            {helloResult && (
              <div className="p-4 bg-gray-100 rounded">{helloResult}</div>
            )}
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Complex Data Demo</h2>
          <div className="space-y-4">
            <input
              type="number"
              value={id}
              onChange={(e) => setId(Number(e.target.value))}
              placeholder="Enter ID"
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Enter filter"
              className="w-full p-2 border rounded"
            />
            <button
              onClick={handleComplexData}
              className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
            >
              Fetch Complex Data
            </button>
            {complexResult && (
              <pre className="p-4 bg-gray-100 rounded overflow-auto">
                {JSON.stringify(complexResult, null, 2)}
              </pre>
            )}
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Protected Profile</h2>
          <button
            onClick={handleLoadProfile}
            className="w-full bg-purple-500 text-white p-2 rounded hover:bg-purple-600"
          >
            Load Profile
          </button>
          {profileData && (
            <pre className="p-4 bg-gray-100 rounded mt-4 overflow-auto">
              {JSON.stringify(profileData, null, 2)}
            </pre>
          )}
        </div>

        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Create Post</h2>
          <div className="space-y-4">
            <input
              type="text"
              value={postInput.title}
              onChange={(e) => setPostInput(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Post title"
              className="w-full p-2 border rounded"
            />
            <textarea
              value={postInput.content}
              onChange={(e) => setPostInput(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Post content"
              className="w-full p-2 border rounded h-24"
            />
            <div className="flex gap-2">
              <input
                type="text"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                placeholder="Add tag"
                className="flex-1 p-2 border rounded"
              />
              <button
                onClick={handleAddTag}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Add Tag
              </button>
            </div>
            {postInput.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {postInput.tags.map((tag, index) => (
                  <span key={index} className="bg-gray-200 px-2 py-1 rounded">{tag}</span>
                ))}
              </div>
            )}
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={postInput.isDraft}
                onChange={(e) => setPostInput(prev => ({ ...prev, isDraft: e.target.checked }))}
              />
              Save as draft
            </label>
            <button
              onClick={handleCreatePost}
              className="w-full bg-indigo-500 text-white p-2 rounded hover:bg-indigo-600"
            >
              Create Post
            </button>
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Posts List</h2>
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="p-4 border rounded">
                <h3 className="text-xl font-semibold">{post.title}</h3>
                <p className="text-gray-600">{post.excerpt}</p>
              </div>
            ))}
            <button
              onClick={handleLoadPosts}
              className="w-full bg-teal-500 text-white p-2 rounded hover:bg-teal-600"
            >
              Load More Posts
            </button>
          </div>
        </div>


      </div>
    </main>
  );
}
