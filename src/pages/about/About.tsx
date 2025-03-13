import { FC } from 'react';
import { Helmet } from 'react-helmet';

import { SSRRouteConfig } from '@type';
import { Article, Br, Heading, P, Page, Section } from '@ui';

const About: FC = () => {
  return (
    <>
      <Helmet>
        <title>About</title>
        <meta name="description" content="Basement pickups about page" />
        <meta name="theme-color" content="#081229" />
      </Helmet>
      <Page>
        <Section>
          <Heading kind="h1">About</Heading>
          <Article gap="L">
            <P>
              Basement Pickups is the offspring of my lifelong love and passion for rock music and
              the fascinating sound of the electric guitar.
            </P>
            <P>
              At an early age, I was introduced to the songs of The Beatles, Smokey, Santana, and
              Jimi Hendrix by my mother and my uncle. Rock music and playing guitar became my refuge
              during my teenage years. I still remember turning the volume to the maximum and
              pressing the headphones to my ears, listening to Accept, Iron Maiden, and Judas
              Priest. The roar of the galloping rhythm guitars and the soaring heights of the lead
              axes were my dream space — my meditation.
            </P>
            <P>
              Decades later, my journey as a chemical engineer, copywriter, web developer and a
              living room guitarist culminated in my hobby of creating electric guitar pickups. It’s
              something that comes from deep within my soul — and my home basement — that I
              sincerely want to share with you.
            </P>
            <P>
              <strong>Roumen Kirov</strong>
              <Br />
              <i>Founder</i>
            </P>
          </Article>
        </Section>
      </Page>
    </>
  );
};

About.displayName = 'About';

export const AboutConfig: SSRRouteConfig = {};

export default About;
