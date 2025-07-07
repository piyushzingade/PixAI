import { Check, CircleCheck } from "lucide-react";


export default function Features() {
  return (
    <section className="bg-neutral-50 min-h-screen  dark:bg-neutral-950 py-16 sm:py-24 lg:py-32">
      {/* Features section */}
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-3xl text-neutral-900 dark:text-neutral-50 font-bold pr-84 mr-4">
          Features
        </h1>

        <div className="flex flex-col gap-4 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 mt-4  ">
          <div className="flex space-x-2 ">
            <CircleCheck className="h-6 w-6 mt-2 text-center text-green-500" />
            <div className="flex flex-col">
              <p className="text-lg font-semibold text-neutral-800 dark:text-neutral-300">
                Image Generation
              </p>
              <p className="text-neutral-500 dark:text-neutral-400 ">
                Generate stunning images from text prompts using advanced AI
                models.
              </p>
            </div>
          </div>

          <div className="flex space-x-2 text-neutral-600 dark:text-neutral-300 ">
            <CircleCheck className="h-6 w-6 mt-2 text-center text-green-500" />
            <div className="flex flex-col">
              <p className="text-lg font-semibold text-neutral-800 dark:text-neutral-300">
                Customization
              </p>
              <p className="text-neutral-500 dark:text-neutral-400 ">
                Generate images with custom prompts, styles, and parameters.
              </p>
            </div>
          </div>

          <div className="flex space-x-2  ">
            <CircleCheck className="h-6 w-6 mt-2 text-center text-green-500" />
            <div className="flex flex-col">
              <p className="text-lg font-semibold text-neutral-800 dark:text-neutral-300">
                High Quality
              </p>
              <p className="text-neutral-500 dark:text-neutral-400 ">
                Create high-resolution images suitable for various applications.
              </p>
            </div>
          </div>

          <div className="flex space-x-2  ">
            <CircleCheck className="h-6 w-6 mt-2 text-center text-green-500" />
            <div className="flex flex-col">
              <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-300">
                Fast
              </h3>
              <p className="text-neutral-500 dark:text-neutral-400 ">
                Experience quick image generation with optimized performance.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Image Section  */}
      <div className=""></div>
    </section>
  );
}
