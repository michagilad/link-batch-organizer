import React, { useState, useMemo } from 'react';
import { SparklesIcon, FileTextIcon, SpinnerIcon, CopyIcon, CheckIcon, LinkIcon } from './components/icons';

const BatchCard: React.FC<{ batchText: string; batchNumber: number }> = ({ batchText, batchNumber }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(batchText).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }).catch(err => {
        console.error("Failed to copy text:", err);
    });
  };

  const linkCount = batchText.split('\n').filter(link => link.trim() !== '').length;

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 animate-fade-in">
      <div className="flex justify-between items-center mb-3">
        <div>
          <h3 className="font-bold text-lg text-gray-200">Batch {batchNumber}</h3>
          <p className="text-sm text-gray-400">{linkCount} links</p>
        </div>
        <button
          onClick={handleCopy}
          aria-label={`Copy batch ${batchNumber}`}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 ${
            isCopied
              ? 'bg-green-600 text-white focus:ring-green-500'
              : 'bg-slate-600 hover:bg-slate-500 text-gray-200 focus:ring-indigo-500'
          }`}
        >
          {isCopied ? (
            <>
              <CheckIcon className="w-4 h-4" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <CopyIcon className="w-4 h-4" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <textarea
        readOnly
        value={batchText}
        className="w-full h-40 p-2 bg-slate-900/70 border border-slate-600 rounded-md text-gray-400 text-sm resize-y font-mono"
        aria-label={`Links for batch ${batchNumber}`}
      />
    </div>
  );
};


const App: React.FC = () => {
  const [linksText, setLinksText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [batches, setBatches] = useState<string[]>([]);
  const [batchSize, setBatchSize] = useState<number>(500);
  const [totalLinksLimit, setTotalLinksLimit] = useState<string>('');

  const linkCount = useMemo(() => {
    if (!linksText) return 0;
    return linksText.split('\n').filter(link => link.trim() !== '').length;
  }, [linksText]);
  
  const isLimitInvalid = useMemo(() => {
    if (!totalLinksLimit) return false; // empty is valid (no limit)
    const limit = parseInt(totalLinksLimit, 10);
    return isNaN(limit) || limit < 1;
  }, [totalLinksLimit]);

  const generateBatches = (textToBatch: string) => {
    if (batchSize < 1) {
        setError('Batch size must be a positive number.');
        return;
    }
     if (isLimitInvalid) {
        setError('Total link limit must be a positive number.');
        return;
    }
    setError(null);
    setIsLoading(true);
    setBatches([]);

    setTimeout(() => {
      try {
        const limit = totalLinksLimit ? parseInt(totalLinksLimit, 10) : 0;
        const allLinks = textToBatch
          .split('\n')
          .filter(link => link.trim());
        
        const linksToProcess = limit > 0 ? allLinks.slice(0, limit) : allLinks;
        
        const generatedBatches: string[] = [];
        
        for (let i = 0; i < linksToProcess.length; i += batchSize) {
          const batch = linksToProcess.slice(i, i + batchSize);
          generatedBatches.push(batch.join('\n'));
        }
        
        setBatches(generatedBatches);

      } catch (err) {
        console.error("Failed to generate batches:", err);
        setError('An unexpected error occurred while generating the batches.');
      } finally {
        setIsLoading(false);
      }
    }, 50);
  };

  const handleAddBackstageUrl = () => {
    if (!linksText.trim()) return;

    const backstageUrl = 'https://backstage.eko.com/experiences/';
    const updatedLinks = linksText
        .split('\n')
        .map(link => link.replace(/\D/g, ''))
        .filter(link => link)
        .map(link => `${backstageUrl}${link}`)
        .join('\n');
    
    setLinksText(updatedLinks);
    generateBatches(updatedLinks);
  };

  const handleGenerateBatches = () => {
    if (!linksText.trim()) {
      setError('Please paste some links first.');
      return;
    }
    generateBatches(linksText);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 text-white flex flex-col items-center p-4 font-sans">
      <main className="w-full max-w-3xl my-8">
        <div className="w-full bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8 transition-all duration-500">
          <div className="flex items-center gap-4 mb-6">
              <div className="bg-indigo-500/20 p-3 rounded-full border border-indigo-500/50">
                  <FileTextIcon className="w-8 h-8 text-indigo-300" />
              </div>
              <div>
                  <h1 className="text-3xl font-bold text-gray-100 tracking-tight">Link Batch Organizer</h1>
                  <p className="text-gray-400 mt-1">Paste links or IDs, get organized batches to copy.</p>
              </div>
          </div>

          <div className="relative">
            <textarea
              value={linksText}
              onChange={(e) => {
                  setLinksText(e.target.value);
                  if (batches.length > 0) {
                      setBatches([]);
                  }
              }}
              placeholder={`Paste your links or IDs here, one per line...\n\nExample:\n"12345"\nabc-67890\nhttps://some-url.com/path/13579`}
              className="w-full h-64 p-4 bg-slate-800/50 border-2 border-slate-700 rounded-lg text-gray-300 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-300 resize-y"
              disabled={isLoading}
              aria-label="Input for links"
            />
            <div className="absolute bottom-3 right-3 bg-slate-900/50 text-xs text-gray-400 px-2 py-1 rounded-md">
              {linkCount} links
            </div>
          </div>
          
          {error && <p className="text-red-400 text-sm mt-3" role="alert">{error}</p>}
          
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="batch-size" className="block text-sm font-medium text-gray-400 mb-2">
                Links per Batch
              </label>
              <input
                type="number"
                id="batch-size"
                value={batchSize > 0 ? batchSize : ''}
                onChange={(e) => setBatchSize(parseInt(e.target.value, 10) || 0)}
                onBlur={() => {
                  if (batchSize < 1) {
                    setBatchSize(500);
                  }
                }}
                min="1"
                placeholder="500"
                className="w-full p-2 bg-slate-800/50 border-2 border-slate-700 rounded-lg text-gray-300 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-300"
                disabled={isLoading}
                aria-label="Set the number of links per batch"
              />
            </div>
            <div>
              <label htmlFor="total-limit" className="block text-sm font-medium text-gray-400 mb-2">
                Total Link Limit (Optional)
              </label>
              <input
                type="number"
                id="total-limit"
                value={totalLinksLimit}
                onChange={(e) => setTotalLinksLimit(e.target.value)}
                min="1"
                placeholder="e.g., 1250"
                className="w-full p-2 bg-slate-800/50 border-2 border-slate-700 rounded-lg text-gray-300 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-300"
                disabled={isLoading}
                aria-label="Set the total number of links to process"
              />
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={handleAddBackstageUrl}
              disabled={isLoading || linkCount === 0 || batchSize < 1 || isLimitInvalid}
              aria-label="Add backstage.eko.com prefix to all links"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-slate-700 focus:outline-none focus:ring-4 focus:ring-slate-500/50 transform hover:scale-105 transition-all duration-300 disabled:bg-slate-500 disabled:cursor-not-allowed disabled:opacity-70 disabled:transform-none"
            >
              <LinkIcon className="w-5 h-5" />
              <span>Add backstage url</span>
            </button>

            <button
              onClick={handleGenerateBatches}
              disabled={isLoading || linkCount === 0 || batchSize < 1 || isLimitInvalid}
              className="w-full flex-1 flex items-center justify-center gap-3 bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/50 transform hover:scale-105 transition-all duration-300 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-70 disabled:transform-none"
            >
              {isLoading ? (
                <>
                  <SpinnerIcon className="w-5 h-5 animate-spin" />
                  <span>Generating Batches...</span>
                </>
              ) : (
                <>
                  <SparklesIcon className="w-5 h-5" />
                  <span>Generate Batches</span>
                </>
              )}
            </button>
          </div>
          <div className="text-center mt-6 text-sm text-gray-500">
              <p>
                {totalLinksLimit && !isLimitInvalid
                  ? `Processing a maximum of ${totalLinksLimit} links in batches of up to ${batchSize}.`
                  : `Each batch will contain up to ${batchSize} links.`
                }
              </p>
          </div>
        </div>
        
        {batches.length > 0 && (
            <section className="w-full mt-8" aria-labelledby="batches-heading">
                <h2 id="batches-heading" className="text-2xl font-bold text-center mb-6 text-gray-300">Your Batches</h2>
                <div className="space-y-6">
                    {batches.map((batch, index) => (
                        <BatchCard key={index} batchText={batch} batchNumber={index + 1} />
                    ))}
                </div>
            </section>
        )}
      </main>
       <footer className="text-center mb-8 text-gray-600 text-sm">
            <p>Powered by React & Tailwind CSS.</p>
      </footer>
    </div>
  );
};

export default App;
