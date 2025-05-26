function CategoryLandingPage() {
  return (
    <div className="w-full py-8 px-2 md:px-8">
      <div className="max-w-5xl mx-auto bg-gradient-to-r from-blue-100 via-white to-pink-100 rounded-3xl shadow-lg p-6 md:p-10">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-indigo-700 mb-8 tracking-tight drop-shadow">Categories</h2>
        <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
          <div className="grid grid-cols-2 gap-4 w-full md:w-1/2">
            <div className="aspect-square rounded-2xl bg-white shadow flex items-center justify-center text-lg font-semibold text-indigo-600 hover:bg-indigo-50 transition-all cursor-pointer">Category 1</div>
            <div className="aspect-square rounded-2xl bg-white shadow flex items-center justify-center text-lg font-semibold text-pink-600 hover:bg-pink-50 transition-all cursor-pointer">Category 2</div>
            <div className="aspect-square rounded-2xl bg-white shadow flex items-center justify-center text-lg font-semibold text-green-600 hover:bg-green-50 transition-all cursor-pointer">Category 3</div>
            <div className="aspect-square rounded-2xl bg-white shadow flex items-center justify-center text-lg font-semibold text-yellow-600 hover:bg-yellow-50 transition-all cursor-pointer">Category 4</div>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full md:w-1/2">
            <div className="aspect-square rounded-2xl bg-white shadow flex items-center justify-center text-lg font-semibold text-indigo-600 hover:bg-indigo-50 transition-all cursor-pointer">Category 5</div>
            <div className="aspect-square rounded-2xl bg-white shadow flex items-center justify-center text-lg font-semibold text-pink-600 hover:bg-pink-50 transition-all cursor-pointer">Category 6</div>
            <div className="aspect-square rounded-2xl bg-white shadow flex items-center justify-center text-lg font-semibold text-green-600 hover:bg-green-50 transition-all cursor-pointer">Category 7</div>
            <div className="aspect-square rounded-2xl bg-white shadow flex items-center justify-center text-lg font-semibold text-yellow-600 hover:bg-yellow-50 transition-all cursor-pointer">Category 8</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoryLandingPage;