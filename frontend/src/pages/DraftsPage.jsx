import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

export default function DraftsPage() {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

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
    if (!window.confirm('Are you sure you want to delete this draft?')) return;
    
    try {
      setDeletingId(draftId);
      const { error } = await supabase
        .from('drafts')
        .delete()
        .eq('id', draftId);

      if (error) throw error;

      setDrafts(drafts.filter(draft => draft.id !== draftId));
    } catch (err) {
      console.error('Error deleting draft:', err);
      setError('Failed to delete draft. Please try again.');
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" text="Loading your drafts..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="md:flex md:items-center md:justify-between mb-8"
      >
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Drafts
          </h1>
          <p className="text-gray-600">
            {drafts.length === 0 
              ? "Start creating your first poster" 
              : `${drafts.length} draft${drafts.length !== 1 ? 's' : ''} saved`
            }
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Button
            to="/questionnaire"
            size="lg"
          >
            Create New Poster
          </Button>
        </div>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-lg"
        >
          {error}
        </motion.div>
      )}

      {drafts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <span className="text-3xl">🎨</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No drafts yet
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Create your first poster by answering a few simple questions. Our AI will generate a unique design just for you.
          </p>
          <Button
            to="/questionnaire"
            size="lg"
          >
            Start Creating
          </Button>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {drafts.map((draft, index) => (
            <motion.div
              key={draft.id}
              variants={itemVariants}
              layout
            >
              <Card className="group relative overflow-hidden">
                {/* Image */}
                <div className="aspect-w-3 aspect-h-2 bg-gray-100">
                  <img
                    src={draft.image_url}
                    alt="Generated poster"
                    className="w-full h-full object-center object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      to={`/poster/${draft.id}`}
                      variant="accent"
                      size="sm"
                    >
                      View Details
                    </Button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm text-gray-500">
                      {new Date(draft.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                    <Button
                      onClick={() => handleDelete(draft.id)}
                      variant="ghost"
                      size="sm"
                      loading={deletingId === draft.id}
                      className="text-error-600 hover:text-error-700 hover:bg-error-50"
                    >
                      {deletingId === draft.id ? 'Deleting...' : 'Delete'}
                    </Button>
                  </div>
                  
                  {/* Draft info */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                      <span>Draft #{draft.id.slice(0, 8)}</span>
                    </div>
                    
                    {/* Show some of the selected options */}
                    {draft.responses && (
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(draft.responses).slice(0, 3).map(([key, value]) => (
                          <span
                            key={key}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                          >
                            {value}
                          </span>
                        ))}
                        {Object.keys(draft.responses || {}).length > 3 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                            +{Object.keys(draft.responses || {}).length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
} 