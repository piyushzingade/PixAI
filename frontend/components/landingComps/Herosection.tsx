"use client";

import Link from "next/link";
import { Button } from "../ui/button"


export const Herosection = () => {
    return (
      <div className="">
        Herosection
        <Button variant="outline">
          <Link href={"/dashboard"}> Get Started</Link>
        </Button>
      </div>
    );
}   