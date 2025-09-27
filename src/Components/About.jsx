
const About = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-5 py-10 bg-gray-50 dark:bg-gray-900">
      <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-6">
        About DevConnect
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl text-center mb-4">
        DevConnect is a platform designed for developers to connect, collaborate, and grow together.
        Whether you’re a beginner or a seasoned professional, you can find like-minded developers,
        share knowledge, and work on projects that matter.
      </p>
      <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl text-center mb-4">
        Our mission is to create a supportive developer community where networking and collaboration
        are seamless and rewarding.
      </p>
      <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl text-center">
        © {new Date().getFullYear()} DevConnect. All rights reserved.
      </p>
    </div>
  );
};

export default About;
