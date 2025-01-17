import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [inputBlog, setInputBlog] = useState({
    name: '',
    author: '',
    description: '',
    image: '',
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setInputBlog((inputBlog) => ({
      ...inputBlog,
      [name]: files ? files[0] : value,
    })); // Update the state with the correct field
  };

  // Submitting Blog
  const handleSubmitBlog = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', inputBlog.name);
    formData.append('author', inputBlog.author);
    formData.append('description', inputBlog.description);
    formData.append('image', inputBlog.image);
    

    try {
      const response = await axios.post(
        'https://blogbackend-e49b.onrender.com/api/v1/blog/createblog',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      console.log('Response from server:', response.data);
      setInputBlog({ name: '', author: '', description: '', image: '' });
      fetchBlog();
    } catch (error) {
      console.error('Error creating blog:', error);
    }
  };


  // Showing All Blog
  const [showBlog, setShowBlog] = useState([]);

  const fetchBlog = async () => {
    try {
      const response = await fetch('https://blogbackend-e49b.onrender.com/api/v1/blog/getallblog');
      const data = await response.json();
      console.log('Fetched Blogs:', data); // Debug: log the fetched data
      setShowBlog(data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  useEffect(() => {
    fetchBlog(); // Fetch blogs on component mount
  }, []);

  return (
    <>
      <div className='bg-[#f3f3d1]'>
        <div className='mx-auto container'>
          <p className='text-center text-[30px]'>Blog</p>
          <div className='mx-auto block py-[50px] px-[25px]'>
            <form className='flex flex-col gap-y-5 ' onSubmit={handleSubmitBlog}>
              <input
                name='name'
                value={inputBlog.name} // Set the current value of name input
                onChange={handleChange}
                type='text'
                placeholder='Blog Name'
                className='w-[250px] px-5 py-3 border rounded-xl'
              />

              <input
                name='author'
                value={inputBlog.author} // Set the current value of author input
                onChange={handleChange}
                type='text'
                placeholder='Author Name'
                className='w-[250px] px-5 py-3 border rounded-xl'
              />
              <div className="w-[250px] bg-[#FFFFFF] flex items-center border border-gray-300 p-2 rounded-lg mb-4">
                  <input
                    type="file"
                    name="image"
                    onChange={handleChange}
                    className="w-[250px]  px-5 py-3 rounded-xl"
                  />
              </div>

              <textarea
                name='description'
                value={inputBlog.description} // Set the current value of description input
                onChange={handleChange}
                type='text'
                placeholder='Blog Description'
                className='w-[550px] h-[150px] px-5 py-3 border rounded-xl text-wrap'
              />

              <button
                type='submit'
                className='w-[120px] h-[40px] bg-amber-500 hover:bg-orange-200 border border-gray-800 rounded-[20px] shadow-2xl transition-all duration-300 hover:p-[5px] hover:shadow-amber-500 font-bold'
              >
                Submit
              </button>
            </form>
          </div>

          <div className='mt-[10px]'>
            <div className='mx-auto grid grid-cols-4 gap-[30px] mt-[22px] justify-around'>
              {Array.isArray(showBlog) && showBlog.length > 0 ? (
                showBlog.map((blog, index) => (
                  <div
                    key={index}
                    className='col-span-1 w-[300px] h-[380px] rounded-[20px] shadow-2xl transition-all duration-300 hover:shadow-amber-500 group'
                  >
                    <div>
                      <img src={blog.image} alt="" className='p-5 transition-all duration-300 group-hover:p-0 w-full h-[200px] object-cover rounded-t-[20px] rounded-b-[20px] group-hover:rounded-b-[0px]' />
                    </div>
                    <div className='w-full p-5'>
                      <p className='font-bold text-[22px]'>{blog.name}</p>
                      <p className='font-semibold mt-2'>
                        Author: <span>{blog.author}</span>
                      </p>
                      <p className='mt-3 text-[18px]'>{blog.description}</p> {/* Ensure this shows the correct description */}
                      <p>{new Date(blog.created).toLocaleDateString()}</p>
                    </div>
                  </div>

                ))
              ) : (
                <p className=' text-red-600'>No blogs available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
