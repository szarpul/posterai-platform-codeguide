import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function DraftsPage() {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDrafts();
  }, []);

  async function fetchDrafts() {
    try {
      setLoading(true);
      setError('');

      const { data, error } = await supabase
        .from('drafts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setDrafts(data || []);
    } catch (err) {
      console.error('Error fetching drafts:', err);
      setError('Failed to load drafts. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(draftId) {
    try {
      const { error } = await supabase
        .from('drafts')
        .delete()
        .eq('id', draftId);

      if (error) throw error;

      setDrafts(drafts.filter(draft => draft.id !== draftId));
    } catch (err) {
      console.error('Error deleting draft:', err);
      setError('Failed to delete draft. Please try again.');
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            My Drafts
          </h2>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Link
            to="/questionnaire"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create New Poster
          </Link>
        </div>
      </div>

      {error && (
        <div className="mt-4 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {drafts.length === 0 ? (
        <div className="mt-8 text-center">
          <p className="text-gray-500">You haven't created any drafts yet.</p>
          <Link
            to="/questionnaire"
            className="mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-500"
          >
            Start creating your first poster
            <span aria-hidden="true"> &rarr;</span>
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {drafts.map((draft) => (
            <div
              key={draft.id}
              className="relative bg-white rounded-lg shadow overflow-hidden"
            >
              <div className="aspect-w-3 aspect-h-2">
                <img
                  src={draft.image_url}
                  alt="Generated poster"
                  className="w-full h-full object-center object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    {new Date(draft.created_at).toLocaleDateString()}
                  </div>
                  <button
                    onClick={() => handleDelete(draft.id)}
                    className="text-red-600 hover:text-red-500 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
                <Link
                  to={`/poster/${draft.id}`}
                  className="mt-4 block w-full text-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 